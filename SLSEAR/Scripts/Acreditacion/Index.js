
function EjecutarDetalleInformacionGeneral() {

    $('#btndescargarrequisitos').on('click', function (e) {

        var datos = { iCodExtensionista: $('#hdnusuario').val()};

        openData('POST', globals.urldescargarrequisito, datos, '_blank');    
    });

    $('#btndescargarAlianzaEstrategica').on('click', function (e) {
        
        var datos = { iCodExtensionista: $('#hdnusuario').val() };

        openData('POST', globals.urldescargaalianzaestrategica, datos, '_blank');  
    });

    $('#btndescargaracta').on('click', function (e) {
        
        console.log('descargar acta');
        var datos = { iCodExtensionista: $('#hdnusuario').val() };

        openData('POST', globals.urldescargaacta, datos, '_blank');  
    });

    $('#btnguardar').on('click', function (e) {
        console.log($("input:radio:checked").length);

        if ($("input:radio:checked").length !=6) {
                notif({
                        msg: "<b>Incorrecto:</b> Debe Seleccionar Requisitos",
                        type: "error"
                    });
        } else {
            loadshow();
            var valorA = ObtenerValorRequisitos('radioA');
            var valorB = ObtenerValorRequisitos('radioB');
            var valorC = ObtenerValorRequisitos('radioC');
            var valorD = ObtenerValorRequisitos('radioD');
            var valorE = ObtenerValorRequisitos('radioE');
            var valorF = ObtenerValorRequisitos('radioF');

            var lista = new Array();

            var iCodExtensionista = $('#hdnusuario').val();

            lista.push({ iCodExtensionista: iCodExtensionista, iCodRequisito: valorA.split('-')[1], bCumple: valorA.split('-')[0] == 1 ? true : false });
            lista.push({ iCodExtensionista: iCodExtensionista, iCodRequisito: valorB.split('-')[1], bCumple: valorB.split('-')[0] == 1 ? true : false });
            lista.push({ iCodExtensionista: iCodExtensionista, iCodRequisito: valorC.split('-')[1], bCumple: valorC.split('-')[0] == 1 ? true : false });
            lista.push({ iCodExtensionista: iCodExtensionista, iCodRequisito: valorD.split('-')[1], bCumple: valorD.split('-')[0] == 1 ? true : false });
            lista.push({ iCodExtensionista: iCodExtensionista, iCodRequisito: valorE.split('-')[1], bCumple: valorE.split('-')[0] == 1 ? true : false });
            lista.push({ iCodExtensionista: iCodExtensionista, iCodRequisito: valorF.split('-')[1], bCumple: valorF.split('-')[0] == 1 ? true : false });

        $(lista).each(function (index,value) {            
            console.log(value);
            $.post(globals.urlRegistrorequisitos, value)
                .done((respuesta) => {                          
                    if (respuesta.iCodListaChequeo == 0) {
                        loadhide();
                    notif({
                        msg: "<b>Incorrecto:</b>Error al Registrar" ,
                       type: "error"
                    });
                    return;
                } else {
                    loadhide();
                    notif({
                        msg: "<b>Correcto:</b>" + respuesta.vMensaje,
                        type: "success"
                    });                
                    $('#btnguardar').attr('disabled', true);
                    $('#btndescargarrequisitos').removeAttr('disabled');                    
                }
            }).fail((error) => {
                console.log(error);
            });
        });
        }      
    });
    function ObtenerValorRequisitos(grupo) {
        var valor = "";
        
        $("input:radio[name=" + grupo + "]:checked").each(function () {
            //debugger;
            var name = $(this).attr("id");            
            valor = $("#" + name).val() + "-" + $(this).attr('data-idrequisito');;
        });

        console.log(valor);
        return valor

    }   
    function openData(verb, url, data, target) {
        var form = document.createElement("form");
        form.action = url;
        form.method = verb;
        form.target = target || "_self";
        if (data) {
            for (var key in data) {
                var input = document.createElement("textarea");
                input.name = key;
                input.value = typeof data[key] === "object" ? JSON.stringify(data[key]) : data[key];
                form.appendChild(input);
            }
        }
        form.style.display = 'none';
        document.body.appendChild(form);
        form.submit();
    }
}


