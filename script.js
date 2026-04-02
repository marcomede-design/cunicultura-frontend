const API = "https://cunicultura-api.onrender.com";

// CADASTRAR ANIMAL
async function cadastrarAnimal() {
  const brinco = document.getElementById("brinco").value;
  const sexo = document.getElementById("sexo").value;
  const raca = document.getElementById("raca").value;
  const nascimento = document.getElementById("nascimento").value;

  try {
    const res = await fetch(`${API}/animais`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        brinco,
        sexo,
        raca,
        nascimento
      })
    });

    const data = await res.json();
    alert("Animal cadastrado com sucesso!");

    listarAnimais();
    carregarDashboard();

  } catch (error) {
    console.error(error);
    alert("Erro ao cadastrar animal");
  }
}

// LISTAR ANIMAIS
async function listarAnimais() {
  try {
    const res = await fetch(`${API}/animais`);
    const animais = await res.json();

    const lista = document.getElementById("listaAnimais");
    lista.innerHTML = "";

    animais.forEach(a => {
      const li = document.createElement("li");
      li.innerText = `ID: ${a.id} | Brinco: ${a.brinco} | Sexo: ${a.sexo} | Raça: ${a.raca}`;
      lista.appendChild(li);
    });

  } catch (error) {
    console.error(error);
  }
}

// DASHBOARD
async function carregarDashboard() {
  try {
    const res = await fetch(`${API}/dashboard`);
    const data = await res.json();

    document.getElementById("dashboard").innerText = JSON.stringify(data, null, 2);

  } catch (error) {
    console.error(error);
  }
}

// AUTO LOAD
listarAnimais();
carregarDashboard();