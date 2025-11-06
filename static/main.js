$(document).ready(function () {
    console.log("✅ Page Loaded");

    // --------------------------
    // 📄 File Upload Handling
    // --------------------------
    $("#file_input").on("change", function (e) {
      const file = e.target.files[0];
      if (!file) return;

      const fileType = file.name.split('.').pop().toLowerCase();
      $("#text_input").val("Reading file... Please wait...");

      if (fileType === "txt") {
        const reader = new FileReader();
        reader.onload = e => $("#text_input").val(e.target.result);
        reader.readAsText(file);
      } else if (fileType === "pdf") {
        const reader = new FileReader();
        reader.onload = function () {
          const typedarray = new Uint8Array(this.result);
          pdfjsLib.getDocument(typedarray).promise.then(async pdf => {
            let fullText = "";
            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const textContent = await page.getTextContent();
              const pageText = textContent.items.map(item => item.str).join(" ");
              fullText += pageText + "\n\n";
            }
            $("#text_input").val(fullText.trim());
          }).catch(err => $("#text_input").val("Error reading PDF: " + err.message));
        };
        reader.readAsArrayBuffer(file);
      } else if (fileType === "docx") {
        const reader = new FileReader();
        reader.onload = e => {
          mammoth.extractRawText({ arrayBuffer: e.target.result })
            .then(result => $("#text_input").val(result.value.trim()))
            .catch(err => $("#text_input").val("Error reading DOCX: " + err.message));
        };
        reader.readAsArrayBuffer(file);
      } else {
        $("#text_input").val("Unsupported file type. Please upload .txt, .pdf, or .docx.");
      }
    });

    // --------------------------
    // 🚀 Submit Analysis via Axios
    // --------------------------

    // Map helper function (same as CodePen)
    function scale(num, in_min, in_max, out_min, out_max) {
      return ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
    }

    // --------------------------
    // 🚀 Submit Analysis via Axios
    // --------------------------
    $("#analysisForm").on("submit", async function (e) {
  e.preventDefault();

  const textInput = $("#text_input").val().trim();
  const resultCard = $("#resultCard");
  const resultOutput = $("#resultOutput");

  if (!textInput) {
    alert("⚠️ Please enter or upload text before analyzing.");
    return;
  }

  try {
    const response = await axios.post("/api/plagiarism", { text_input: textInput });
    const data = response.data;

    resultCard.removeClass("d-none");

    if (data.status === "success") {
      const result = data.result;
      const scoreValue = parseFloat(result.similarity_score.replace('%', '')) || 0;
      const badgeClass =
        scoreValue < 20 ? "bg-success" :
        scoreValue < 50 ? "bg-warning text-dark" :
        "bg-danger";

      const userTokens = result.tokens.user_tokens.join(", ");
      const refTokens = result.tokens.reference_tokens.join(", ");

      const ui = `
        <div class="mb-3">
          <h5 class="fw-bold mb-2"><i class="bi bi-percent"></i> Similarity Score</h5>
          <div class="progress" style="height: 25px;">
            <div class="progress-bar ${badgeClass}" style="width: ${scoreValue}%;">
              ${result.similarity_score}
            </div>
          </div>
        </div>

        <div class="mt-4">
          <h5 class="fw-bold"><i class="bi bi-graph-up-arrow"></i> Interpretation</h5>
          <span class="badge ${badgeClass} fs-6 p-2">${result.interpretation}</span>
        </div>

        <hr class="my-4">

        <div class="row text-center">
          <div class="col-md-6">
            <div class="card border-success shadow-sm mb-3">
              <div class="card-header bg-success text-white fw-bold">User Text</div>
              <div class="card-body">
                <p><strong>Total Tokens:</strong> ${result.lexical_analysis.user.total_tokens}</p>
                <p><strong>Unique Tokens:</strong> ${result.lexical_analysis.user.unique_tokens}</p>
                <p><strong>Keyword Count:</strong> ${result.lexical_analysis.user.keyword_count}</p>
                <button class="w-100 btn btn-outline-success btn-sm mt-2 toggle-tokens" data-target="#userTokens">Show Tokens</button>
                <div id="userTokens" class="tokens-box mt-2 p-2 border rounded d-none text-start small bg-light">${userTokens}</div>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="card border-primary shadow-sm mb-3">
              <div class="card-header bg-primary text-white fw-bold">Reference Text</div>
              <div class="card-body">
                <p><strong>Total Tokens:</strong> ${result.lexical_analysis.reference.total_tokens}</p>
                <p><strong>Unique Tokens:</strong> ${result.lexical_analysis.reference.unique_tokens}</p>
                <p><strong>Keyword Count:</strong> ${result.lexical_analysis.reference.keyword_count}</p>
                <button class="w-100 btn btn-outline-primary btn-sm mt-2 toggle-tokens" data-target="#refTokens">Show Tokens</button>
                <div id="refTokens" class="tokens-box mt-2 p-2 border rounded d-none text-start small bg-light">${refTokens}</div>
              </div>
            </div>
          </div>
        </div>
      `;

      resultOutput.html(ui);

      // Handle show/hide token list toggle
      $(".toggle-tokens").on("click", function () {
        const target = $(this).data("target");
        const box = $(target);
        const isVisible = !box.hasClass("d-none");
        box.toggleClass("d-none");
        $(this).text(isVisible ? "Show Tokens" : "Hide Tokens");
      });
    } else {
      resultOutput.html(`<div class="alert alert-danger">❌ Error: ${data.message}</div>`);
    }
  } catch (err) {
    console.error(err);
    resultOutput.html(`<div class="alert alert-danger">🚨 Request failed: ${err.message}</div>`);
  }
});




  });
