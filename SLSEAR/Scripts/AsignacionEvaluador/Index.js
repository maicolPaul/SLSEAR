let general = {
    tblsears:null
}

function EjecutarDetalleInformacionGeneral() {
    //alert('evaluador');

    $.post(globals.urlUbigeoDepartamento)
        .done((respuesta) => {
            //debugger;
            $.each(respuesta, function (key, value) {
                $('#cbodepartamento').append("<option value='" + value.vCodDepartamento + "' data-value='" + JSON.stringify(value.vCodDepartamento) + "'>" + value.vNomDepartamento + "</option>");
            });
        });

    general.tblsears = $("#tblsears").DataTable({
        bFilter: false
        , serverSide: true
        , searching: false
        , lengthChange: true
        , paging: true
        , autoWidth: false
        , processing: true
        //, dom: 'tr<"footer"l<"paging-info valign-wrapper"ip>>'
        , drawCallback: function () {
            $('#tblsears thead').attr('class', 'table-success');
            $('[data-toggle="tooltip"]').tooltip();
        }
        , language: globals.lenguajeDataTable
        , ajax: function (data, callback, settings) {
            let paginaActual = 1 + (parseInt(settings._iDisplayStart) / parseInt(settings._iDisplayLength));
            let parametro = {
                piPageSize: parseInt(settings._iDisplayLength)
                , piCurrentPage: paginaActual
                , pvSortColumn: "iCodIdentificacion"
                , pvSortOrder: "asc"
                , iCodUbigeoT1: ""
            };
            $.ajax({
                type: "POST",
                url: globals.urlWebApi + "api/AsignacionEvaluador/ListarSear",
                headers: { Accept: "application/json" /*, Authorization: `Bearer ${globals.sesion.token}`*/ },
                dataType: 'json',
                data: parametro
            })
                .done(function (data) {
                    callback({
                        data: data,
                        recordsTotal: data.length !== 0 ? data[0].totalRegistros : 0,
                        recordsFiltered: data.length !== 0 ? data[0].totalRegistros : 0
                    });
                })
                .fail(function (error) {
                    console.log(error);
                    cuandoAjaxFalla(error.status);
                });
        }
        , columns: [
            {
                className: 'dt-control',
                orderable: false,
                data: null,
                defaultContent: '',
            },
            { data: "iCodIdentificacion", title: "iCodCausaDirecta", visible: false, orderable: false },
            { data: "vNombreSearT1", title: "iCodIdentificacion", visible: true, orderable: false },
            { data: "vEstado", title: "Estado", visible: true, orderable: false },
            {
                data: (row) => {
                    let acciones = `<div class="nav-actions">`;
                    /*acciones += `<a href="javascript:void(0);" onclick ="EditarCausaDirecta(this);" data-toggle="tooltip" title="Editar"><i class="bi bi-pencil"></i></a>`;*/
                    //acciones += `<a href="javascript:void(0);" onclick ="EliminarCausaDirecta(this);"  data-toggle="tooltip" title="Eliminar"><i class="bi bi-trash-fill"></i></a>&nbsp&nbsp&nbsp`;
                    acciones += `<a href="javascript:void(0);" onclick ="AsignarEvaluadores(${row.iCodIdentificacion});"  data-toggle="tooltip" title="Asignar Evaluadores"><i class="fa fa-plus-circle" aria-hidden="true"></a>`;
                    acciones += `</div>`;
                    return acciones;
                }, title: "Acciones", visible: true, orderable: false
            }
        ]
    });

}

function AsignarEvaluadores(iCodIdentificacion) {
    $('#modalasignar').modal({ backdrop: 'static', keyboard: false });
    $('#modalasignar').modal('show');  
    

}

    