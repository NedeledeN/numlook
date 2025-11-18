document.getElementById("searchForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const phone = document.getElementById("phone").value;
  const resultBox = document.getElementById("result");

  resultBox.innerHTML = "Recherche en cours...";
  resultBox.classList.remove("hidden");

  const res = await fetch(`http://localhost:3000/search?phone=${encodeURIComponent(phone)}`);
  const data = await res.json();

  resultBox.innerHTML = `
    <h3>Résultats :</h3>
    <p><b>Valide :</b> ${data.valid}</p>
    <p><b>Numéro formaté :</b> ${data.international_format || "N/A"}</p>
    <p><b>Pays :</b> ${data.country_name || "N/A"}</p>
    <p><b>Code pays :</b> ${data.country_code || "N/A"}</p>
    <p><b>Opérateur :</b> ${data.carrier || "N/A"}</p>
    <p><b>Type :</b> ${data.line_type || "N/A"}</p>
  `;
});
