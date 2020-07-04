$(document).ready(async function(){
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
  var t = $('#table').DataTable();
  const user = stash.get('user_cliente');
  if(user){
    const res = await axios.get(`http://localhost:3000/solicitacoes/usuario/${user.idusuario}`);
    const response = res.data;

    if (response.error === undefined || response.error === '') {
      const solicitacoes = response.solicitacoes;
      solicitacoes.map(function(solicitacao) {
        let status;
        switch (solicitacao.status) {
          case "P":
            status = "PENDENTE";
            break;
          case "E":
            status = "EM COLETA";
            break;
          case "F":
            status = "FINALIZADA";
            break;
          case "C":
            status = "CANCELADA";
            break;
        
          default:
            break;
        }
        t.row.add( [
          ( solicitacao.status === "P" 
            ? `<a id_delete="${solicitacao.idsolicitacao}" id_associacao="${solicitacao.idassoci}" id_catador="${solicitacao.idcoletor}"  class="deletar" href="#"><i class="fas far fa-trash-alt"></i></a>`
            : '<div></div>'
          ),
          `<a href="./form.html?cd=${solicitacao.idsolicitacao}"> <i class="fas fa-pencil-alt"></i></a>`,
          solicitacao.nomeusuario,
          solicitacao.telefone,
          (solicitacao.coletor ? solicitacao.coletor : 'Nenhum coletor alocado'),
          solicitacao.cidade+"/"+solicitacao.uf,
          status,
        ] ).draw( false );
      });
    }     
  }

  $('.deletar').click(async function(e) {
    const id_solicitacao = $(this).attr('id_delete');
    const id_associacao = $(this).attr('id_associacao');
    const id_catador = $(this).attr('id_catador');

    e.preventDefault();
    bootbox.confirm({
      message: 'Realmente deseja cancelar a coleta?',
      centerVertical: true,
      buttons: {
        confirm: {
          label: 'Sim',
          className: 'btn-danger',
        },
        cancel: {
          label: 'Não',
          className: 'btn-primary',
        },
      },
      async callback(result) {
        if(result){ // se clicar em sim
          const res = await axios.put(`http://localhost:3000/solicitacoes/atualizar`, {
            id_solicitacao,
            status: "C",
            id_associacao,
            id_catador
          });
          const response = res.data;
          if (response.error === undefined || response.error === '') {
            stash.set('alertSuccess', 'Solicitação cancelada com succeso!');
            window.location.href = './index.html';
          }else{
            $.notify({
                message: "Ops... Não foi possível cancelar a solicitação, tente novamente em alguns instantes."
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
      },
    });
  })
});

