$(document).ready(async function(){
  moment.locale('pt-br');
  if(stash.get('alertSuccess') != "" && stash.get('alertSuccess') != undefined){
    let msg = stash.get('alertSuccess');
    stash.cut('alertSuccess');
    $.notify({
      // options
      // title: 'Be Alert,',
      message: msg
    },{
        placement: {
          from: "top",
          align: "right",
        },
        timer: 100,
        // settings
        type: 'success',
        animate: {
          enter: 'animated fadeInDown',
          exit: 'animated fadeOutUp'
        },
    });
	}
  const searchParams = new URLSearchParams(window.location.search)//buscando os parametros passados na 'url'
  const user = stash.get('user_cliente');

  if(user){
    const res = await axios.get(`http://localhost:3000/user/${user.idusuario}`);
    const response = res.data;
    if (response.error === undefined || response.error === '') {
      const user_row = response.user[0];
      stash.set('user_pass', user_row.senha);
      $("#nome_user").val(user_row.nomeusuario);
      $("#email_user").val(user_row.email);
      $("#cpf_user").val(user_row.cpf);
      $("#telefone_user").val(user_row.telefone);
      $("#cep_user").val(user_row.cep);
      $("#numero_user").val(user_row.numero);
      $("#rua_user").val(user_row.rua);
      $("#bairro_user").val(user_row.bairro);
      $("#cidade_user").val(user_row.cidade);
      $("#uf_user").val(user_row.uf);
    }   
  }
  

  $('.btnSubmit').click(async function(){
    let form = $(this).parents('form:first');
    let returnValidation = await validation(form);
    if(returnValidation === true){
      let senha;
      if($("#senha_user").val() !== "")
        senha = $("#senha_user").val();

      const nome = $("#nome_user").val();
      const mail = $("#email_user").val();
      const cpf = $("#cpf_user").val();
      const telefone = $("#telefone_user").val();
      const cep = $("#cep_user").val();
      const numero = $("#numero_user").val();
      const rua = $("#rua_user").val();
      const bairro = $("#bairro_user").val();
      const cidade = $("#cidade_user").val();
      const uf = $("#uf_user").val();
      const res = await axios.put(`http://localhost:3000/user/alterar`, {
        idusuario: user.idusuario,
        nome,
        mail,
        cpf,
        telefone,
        cep,
        numero,
        rua,
        bairro,
        cidade,
        uf,
        senha: (senha ? senha : stash.get('user_pass'))
      });
      const response = res.data;
      if (response.error === undefined || response.error === '') {
        stash.set('alertSuccess', 'Cadastro atualizado com succeso!');
        window.location.href = './index.html';
      }else{
        $.notify({
            message: "Ops... Não foi possível atualizar o user, tente novamente em alguns instantes."
          },{
            placement: {
              from: "top",
              align: "right",
            },
            timer: 100,
            // settings
            type: 'danger',
            animate: {
              enter: 'animated fadeInDown',
              exit: 'animated fadeOutUp'
            },
        });
      }
    
    }else{
      $('.formError').fadeIn().html(returnValidation);
    }
    
  });

  async function validation(form){
    let msg = "";
  
    form.find(".required").each(function(){
      if( $(this).val() == "" ){
          msg += '<div><i class="mdi mdi-information-outline"></i>&nbsp;&nbsp;<span>'+$(this).attr("description")+'</span>.</div>';
      }
    });
    if( msg != "" ){
        return '<div style="font-weight:500">Os campos abaixo são obrigatórios:</div>'+msg;
    } else {
        return true;
    }
  }
});

