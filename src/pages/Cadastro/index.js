$(document).ready(async function(){
  $('.btnSubmit').click(async function(){
    const nome = $("#nome").val();
    const cpf = $("#cpf").val();
    const mail = $("#mail").val();
    const senha = $("#senha").val();
    const repitaSenha = $("#repitaSenha").val();
    const telefone = $("#telefone").val();
    const numero = $("#numero").val();
    const cep = $("#cep").val();
    const rua = $("#rua").val();
    const bairro = $("#bairro").val();
    const cidade = $("#cidade").val();
    const uf = $("#uf").val();
    if(senha !== repitaSenha){
      $("#textSuccess").hide()
      $("#textError").show();
      $("#textError").html("Senhas diferentes!");
      window.scrollTo(0, 0);
    }else{
      const res = await axios.post(`http://localhost:3000/user`, {
        nome,  
        mail,
        cpf,
        senha,
        telefone,
        numero,
        cep,
        rua,
        bairro,
        cidade,
        uf    
      });
      const response = res.data;
      if (response.error === undefined || response.error === '') {
        $("#textError").hide();
        $("#textSuccess").html("Cadastro efetuado com sucesso!");
        $("#textSuccess").show()
        window.scrollTo(0, 0);
        setTimeout(() => {
          window.location.href = '../Login/index.html';
        }, 2000);
      }else{
        window.scrollTo(0, 0);
        $("#textSuccess").hide()
        $("#textError").show();
        $("#textError").html("Ops... Não foi possível concluir o cadastro, tente novamente em alguns instantes.");
      }
    }
    
  });  
});