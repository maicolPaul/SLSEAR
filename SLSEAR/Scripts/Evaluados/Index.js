let general = {
    usuario: 0,
    iEnvio: 0,
    tblsears: null,
    seleccionado:null
};

function EjecutarDetalleInformacionGeneral() {
    var arreglousuario = new Array();

    arreglousuario = $('#hdnusuario').val().split('|');
    debugger;
    general.usuario = arreglousuario[0];

    general.iEnvio = arreglousuario[7];

    $('#cboDepartamento').empty();
    $('#cboDepartamento').append("<option value='0'>Seleccione</option>");

    $.when(obtenerRegion({}))
        .done((regiones) => {
            $.each(regiones, function (key, value) {
                $('#cboDepartamento').append("<option value='" + value.vCodDepartamento + "' data-value='" + JSON.stringify(value.vCodDepartamento) + "'>" + value.vNomDepartamento + "</option>");
            });
        });

    $('#btnelegirganador').on('click', function (e) {
        //alert('grabo');
        let parametro = {};

        parametro.iCodIdentificacion = general.seleccionado.iCodIdentificacion;

        $.post(globals.urlWebApi + "api/FichaEvaluacion/InsertarGanador",parametro)
            .done((respuesta) => {
                console.log(respuesta);
                if (respuesta.iCodganador > 0) {
                    $('#modalelegirganador').modal('hide');
                }
            }).fail((error) => {
                console.log(error);
            });
    });

    general.tblsears = $("#tblsears").DataTable({
        bFilter: false
        , serverSide: true
        , searching: false
        , lengthChange: false
        , paging: true
        , autoWidth: false
        , processing: true
        //, dom: 'tr<"footer"l<"paging-info valign-wrapper"ip>>'
        , drawCallback: function () {
            //$('select[name="tblComunidadOpa_length"]').formSelect();
            //$('.tooltipped').tooltip();
            $('#tblsears thead').attr('class', 'table-success');
            $('[data-toggle="tooltip"]').tooltip();
        }
        , language: globals.lenguajeDataTable
        , ajax: function (data, callback, settings) {
            let paginaActual = 1 + (parseInt(settings._iDisplayStart) / parseInt(settings._iDisplayLength));
            let parametro = {
                piPageSize: parseInt(settings._iDisplayLength)
                , piCurrentPage: paginaActual
                , pvSortColumn: "iCodActividad"
                , pvSortOrder: "asc"
                , iCodComiteEvaluador: general.iEnvio == 4 ? general.usuario : 0
                /*, iCodIdentificacion: $("#cboComponente").val()*/
                ,  vCodDepartamento: $('#cboDepartamento').val()
            };
            debugger;
            $.ajax({
                type: "POST",
                url: globals.urlWebApi + "api/FichaEvaluacion/ListarEvaluadoFinalizados",
                headers: { Accept: "application/json" /*, Authorization: `Bearer ${globals.sesion.token}`*/ },
                dataType: 'json',
                data: parametro
            })
                .done(function (data) {
                    debugger;
                    callback({
                        data: data,
                        recordsTotal: data.length !== 0 ? data[0].iRecordCount : 0,
                        recordsFiltered: data.length !== 0 ? data[0].iRecordCount : 0
                    });                    
                })
                .fail(function (error) {
                    console.log(error);
                    cuandoAjaxFalla(error.status);
                });
        }
        , columns: [
            { data: "iCodComiteIdentificacion", title: "iCodComiteIdentificacion", visible: false, orderable: false },
            { data: "iCodComiteEvaluador", title: "iCodComiteEvaluador", visible: false, orderable: false },
            { data: "iCodIdentificacion", title: "iCodIdentificacion", visible: false, orderable: false },
            { data: "vNombreSearT1", title: "Nombre Sear", visible: true, orderable: false },
            { data: "vDireccionT2", title: "Direccion", visible: false, orderable: false },
            { data: "iCodUbigeoT1", title: "iCodUbigeoT1", visible: false, orderable: false },
            { data: "vNomDepartamento", title: "Departamento", visible: true, orderable: false },
            { data: "vNomProvincia", title: "Provincia", visible: true, orderable: false },
            { data: "vNomDistrito", title: "Distrito", visible: true, orderable: false },
            { data: "iCodExtensionista", title: "iCodExtensionista", visible: false, orderable: false },
            { data: "EvaluadoFinalizar", title: "EvaluadoFinalizar", visible: false, orderable: false },
            {
                data: (row) => {
                    let acciones = `<div class="nav-actions">`;
                    //acciones += `&nbsp&nbsp&nbsp<a href="javascript:void(0);" onclick ="VerFichaEvaluacion(this);" data-toggle="tooltip" title="Ver Evaluacion"><i class="bi bi-card-checklist"></i></a>&nbsp&nbsp&nbsp`;
                    //acciones += `<a href="javascript:void(0);" onclick ="DescargarFicha(this);" data-toggle="tooltip" title="Descargar Ficha"><i class="fa fa-print"></i></a>&nbsp&nbsp&nbsp`;
                    acciones += `<a href="javascript:void(0);" onclick ="Finalizarevaluacion(this);" data-toggle="tooltip" title="Elegir Ganador Evaluacion"><i class="fa fa-check"></i></a>&nbsp&nbsp&nbsp`;

                    //acciones += `<a href="javascript:void(0);" onclick ="DescargarG(this);" data-toggle="tooltip" title="Descargar Ficha"><i class="fa fa-print"></i></a>&nbsp&nbsp&nbsp`;
                    //if (row.existe == 0) {
                    //acciones += `<a href="javascript:void(0);" onclick ="eliminarCosto(this);"  data-toggle="tooltip" title="Eliminar"><i class="bi bi-trash-fill"></i></a>`;
                    //}
                    acciones += `</div>`;
                    return acciones;
                }, title: "Acciones", visible: true, orderable: false
            }
        ]
    });
}

function Finalizarevaluacion(obj) {
    general.seleccionado = general.tblsears.row($(obj).parents('tr')).data();

    $('#modalelegirganador').modal({ backdrop: 'static', keyboard: false });
    $('#modalelegirganador').modal('show');
}
    

function obtenerRegion(data) {
    return $.ajax({ type: "POST", url: globals.urlUbigeoDepartamento, headers: { Accept: "application/json" }, dataType: 'json', data: data });
}