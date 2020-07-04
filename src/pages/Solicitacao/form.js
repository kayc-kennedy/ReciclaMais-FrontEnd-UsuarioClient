$(document).ready(async function(){
  moment.locale('pt-br');
  const searchParams = new URLSearchParams(window.location.search)//buscando os parametros passados na 'url'
  console.log(searchParams.get('cd'));
  console.log(searchParams.has('cd'));//verificando se possui 
  const user = stash.get('user_cliente');
  if(user){
    const res = await axios.get(`http://localhost:3000/catador`);
    const response = res.data;

    if (response.error === undefined || response.error === '') {
      const catadores = response.catadores;
      var $dropdown = $("#idcoletor_solicitacao");
        $.each(catadores, function() {
            $dropdown.append($("<option />").val(this.idcoletor).text(this.coletor));
        });
    }     
  }

  if(searchParams.has('cd')){
    $('#form_solicitacao').find(".form-control").each(function(){
      $(this).attr("disabled", true)
      if($(this).hasClass("btnSubmit"))
        $(this).hide();
    });
    const solicitacao = searchParams.get('cd');
    if(user){
      const res = await axios.get(`http://localhost:3000/solicitacoes/usuario/${user.idusuario}/${solicitacao}`);
      const response = res.data;
      if (response.error === undefined || response.error === '') {
        const solicitacao = response.solicitacoes[0];
        $("#data_solicitacao").val(moment(solicitacao.datahorasolici).format('LLL'));
        $("#status_solicitacao").val(solicitacao.status);
        $("#tipo_lixo_solicitacao").val(solicitacao.idlixo);
        $("#nome_solicitacao").val(solicitacao.nomeusuario);
        $("#idcoletor_solicitacao").val(solicitacao.idcoletor);
        $("#telefone_solicitacao").val(solicitacao.telefone);
        $("#cep_solicitacao").val(solicitacao.cep);
        $("#numero_solicitacao").val(solicitacao.numero);
        $("#rua_solicitacao").val(solicitacao.rua);
        $("#bairro_solicitacao").val(solicitacao.bairro);
        $("#cidade_solicitacao").val(solicitacao.cidade);
        $("#uf_solicitacao").val(solicitacao.uf);
      }   
    }
  }else{
    if(user){
      $("#data_solicitacao").val(dataAtualFormatada);
      $("#nome_solicitacao").val(user.nomeusuario);
      $("#cep_solicitacao").val(user.cep);
      $("#numero_solicitacao").val(user.numero);
      $("#rua_solicitacao").val(user.rua);
      $("#bairro_solicitacao").val(user.bairro);
      $("#cidade_solicitacao").val(user.cidade);
      $("#uf_solicitacao").val(user.uf); 
      $("#telefone_solicitacao").val(user.telefone); 
    }
    
  }

  $('.btnSubmit').click(async function(){
    let form = $(this).parents('form:first');
    let returnValidation = await validation(form);
    if(returnValidation === true){
      if(!searchParams.has('cd')){
        const rua = $("#rua_solicitacao").val();
        const numero = $("#numero_solicitacao").val();
        const bairro = $("#bairro_solicitacao").val();
        const cidade = $("#cidade_solicitacao").val();
        const uf = $("#uf_solicitacao").val();
        const cep = $("#cep_solicitacao").val();
        const tipo_lixo = $("#tipo_lixo_solicitacao").val();
        const res = await axios.post(`http://localhost:3000/solicitacoes`, {
          id_usuario: user.idusuario,
          rua,
          numero,
          bairro,
          cidade,
          uf,
          cep,
          tipo_lixo
        });
        const response = res.data;
        if (response.error === undefined || response.error === '') {
          stash.set('alertSuccess', 'Solicitação feita com succeso!');
          window.location.href = './index.html';
        }else{
          $.notify({
              message: "Ops... Não foi possível atualizar o solicitacao, tente novamente em alguns instantes."
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

  function dataAtualFormatada(){
    var data = new Date(),
        dia  = data.getDate().toString(),
        diaF = (dia.length == 1) ? '0'+dia : dia,
        mes  = (data.getMonth()+1).toString(), //+1 pois no getMonth Janeiro começa com zero.
        mesF = (mes.length == 1) ? '0'+mes : mes,
        anoF = data.getFullYear();
    return diaF+"/"+mesF+"/"+anoF;
}
});

