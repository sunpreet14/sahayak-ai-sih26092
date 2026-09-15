const $ = (id) => document.getElementById(id);
const formatINR = (n) => n == null ? "—" : new Intl.NumberFormat("en-IN", {style:"currency", currency:"INR", maximumFractionDigits:0}).format(n);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[c]));

let savedProfile = null;

async function loadSavedProfile() {
  try {
    const user = JSON.parse(sessionStorage.getItem("user") || "{}");
    if (!user.id) return;
    const res = await fetch(`http://localhost:5000/api/profile/${user.id}`);
    if (!res.ok) return;
    const data = await res.json();
    savedProfile = data.user || null;
    if (!savedProfile) return;

    if (savedProfile.projectCost) $("projectCost").value = savedProfile.projectCost;
    if (savedProfile.age) $("age").value = savedProfile.age;
    if (savedProfile.state) $("state").value = savedProfile.state;
    if (savedProfile.category) $("category").value = savedProfile.category;

    const status = $("voiceStatus");
    if (status) status.textContent = "Your saved profile is loaded ✓";
  } catch (e) {
    console.warn("Could not load saved profile", e);
  }
}

loadSavedProfile();

const demoText = "I want to start a small business. My annual income is 3 lakh and I need a loan of 1 lakh.";
$("demoBtn").onclick = () => { $("textInput").value = demoText; $("projectCost").value = 120000; $("age").value = 25; };
document.querySelectorAll(".quick-row button").forEach(b => b.onclick = () => $("textInput").value = b.dataset.text);

$("findBtn").onclick = async () => {
  const text = $("textInput").value.trim();
  $("error").textContent = "";
  if (!text) { $("error").textContent = "Please describe what you need first."; return; }
  const btn = $("findBtn"); btn.disabled = true; btn.innerHTML = "Analyzing your requirement…";
  try {
    const params = new URLSearchParams({
      text,
      project_cost: $("projectCost").value || (savedProfile?.projectCost || 0),
      age: $("age").value || (savedProfile?.age || 25),
      state: $("state").value || (savedProfile?.state || "Punjab"),
      category: $("category").value || (savedProfile?.category || "SC"),
      profile_income: savedProfile?.familyIncome || 0,
      profile_purpose: savedProfile?.purpose || "business",
      education_status: savedProfile?.education || "not_student"
    });
    const res = await fetch(`http://127.0.0.1:8000/smart-text?${params}`);
    const data = await res.json();
    if (!res.ok || data.error) throw new Error(data.error || "Unable to process request.");
    render(data);
  } catch(e) { $("error").textContent = e.message; }
  finally { btn.disabled = false; btn.innerHTML = "Find my best options <span>→</span>"; }
};

function render(data){
  const schemes = [...(data.scheme_recommendations?.loan_recommendations || []), ...(data.scheme_recommendations?.support_recommendations || [])];
  $("results").classList.remove("hidden");
  $("count").textContent = schemes.length;
  const u = data.understood_input || data.applicant || {};
  $("summary").textContent = `We understood: ${u.purpose || "requirement"} • ${formatINR(u.income)} annual income • ${formatINR(u.loan_amount)} requested`;
  const best = data.best_scheme || schemes[0];
  $("bestScheme").innerHTML = best ? `
    <div class="best-name">${esc(best.scheme_name)}</div>
    <div class="best-meta">${esc(best.ministry)} • ${esc(best.support_type || best.scheme_type)}</div>
    <span class="score">${esc(best.recommendation_level)} · ${esc(best.match_score)}/100</span>
    ${(best.reasons||[]).slice(0,3).map(r=>`<div class="reason">✓ ${esc(r)}</div>`).join("")}
    ${best.warnings?.length ? `<div class="reason">⚠ ${esc(best.warnings[0])}</div>` : ""}
  ` : `<div class="best-name">No direct financing match</div><div class="best-meta">Try adjusting the project cost, loan amount or requirement.</div>`;

  const emi = data.financial_calculation;
  $("emi").innerHTML = emi ? `
    <div class="emi-main">${formatINR(emi.monthly_emi)}</div><div class="emi-label">estimated monthly EMI</div>
    <div class="emi-grid"><div><b>${formatINR(emi.total_interest)}</b><span>Total interest</span></div><div><b>${esc(emi.tenure_months)} mo</b><span>Illustrative tenure</span></div></div>
  ` : `<div class="best-name">Not available</div><div class="best-meta">No suitable scheme interest rate was available for an EMI estimate.</div>`;

  $("schemeList").innerHTML = schemes.length ? schemes.slice(0,8).map((s,i)=>`
    <div class="scheme"><div><h4>${i===0?"★ ":""}${esc(s.scheme_name)}</h4><div class="sub">${esc(s.scheme_type)} • ${esc(s.support_type)} • ${esc(s.ministry)}</div><span class="tag">${esc(s.recommendation_level)}</span></div><div class="scheme-right"><b>${esc(s.match_score)}/100</b><span>match score</span><div class="sub">${s.maximum_loan === "Not specified" ? "Limit: —" : "Up to "+formatINR(s.maximum_loan)}</div></div></div>
  `).join("") : `<div class="sub">No eligible options found for the supplied profile.</div>`;

  const partners = data.nearest_partners || [];
  $("partners").innerHTML = partners.length ? partners.map(p=>`<div class="partner"><b>${esc(p.partner_name)}</b><span>${esc(p.city)}, ${esc(p.state)}</span><span>${esc(p.partner_type)}</span><span class="distance">${esc(p.distance_km)} km away</span></div>`).join("") : `<div class="sub">No matching partner in the currently loaded partner dataset.</div>`;
  setTimeout(()=>$("results").scrollIntoView({behavior:"smooth",block:"start"}),100);
}

/* Voice input: Chrome/Edge Web Speech API */
const voiceBtn = document.getElementById("voiceBtn");
const voiceStatus = document.getElementById("voiceStatus");
const textInput = document.getElementById("textInput");
const languageSelect = document.getElementById("languageSelect");
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (voiceBtn && SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;

  voiceBtn.addEventListener("click", () => {
    recognition.lang = languageSelect.value;
    try {
      recognition.start();
      voiceBtn.classList.add("listening");
      voiceBtn.textContent = "🔴 Listening...";
      voiceStatus.textContent = "Speak your requirement...";
    } catch (_) {
      voiceStatus.textContent = "Please wait and try again.";
    }
  });

  recognition.onresult = (event) => {
    textInput.value = event.results[0][0].transcript;
    voiceBtn.classList.remove("listening");
    voiceBtn.textContent = "🎤 Speak";
    voiceStatus.textContent = "Voice captured successfully";
  };

  recognition.onerror = (event) => {
    voiceBtn.classList.remove("listening");
    voiceBtn.textContent = "🎤 Speak";
    voiceStatus.textContent = event.error === "not-allowed"
      ? "Microphone permission was denied."
      : "Could not hear you. Try again.";
  };

  recognition.onend = () => {
    voiceBtn.classList.remove("listening");
    voiceBtn.textContent = "🎤 Speak";
  };
} else if (voiceBtn) {
  voiceBtn.disabled = true;
  voiceStatus.textContent = "Voice input is not supported in this browser.";
}
