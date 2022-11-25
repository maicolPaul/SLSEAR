
let general = {
    usuario: 0,
    
};

function EjecutarDetalleInformacionGeneral() {
    debugger;
    var arreglousuario = new Array();

    arreglousuario = $('#hdnusuario').val().split('|');

    general.usuario = arreglousuario[0];

    $('#btnGenerarExportado').on('click', function () {

        debugger;
        var datos = {};
        datos.iCodExtensionista = general.usuario;

        openData('POST', globals.urlWebApi + 'api/Costo/ExportarFichaTecnica', datos, '_blank');

        openData('POST', globals.urlWebApi + 'api/Costo/ExportarCosto', datos, '_blank');

        openData('POST', globals.urlWebApi + 'api/Cronograma/ExportarCronograma', datos, '_blank');

        openData('POST', globals.urlWebApi + 'api/PlanCapacitacion/ExportarPlanCapa', datos, '_blank');

        openData('POST', globals.urlWebApi + 'api/PlanAsistenciaTec/ExportarPlanAsistenciaTec', datos, '_blank');
    });

    $('#btnEnviar').on('click', function () {
        
        
    });


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


