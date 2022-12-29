let general = {
    tblsears: null,
    elementoseleccionado:null
}

function EjecutarDetalleInformacionGeneral() {
    //alert('evaluador');
    cargarusuario(12);
    $.post(globals.urlUbigeoDepartamento)
        .done((respuesta) => {
            //debugger;
            $.each(respuesta, function (key, value) {
                $('#cbodepartamento').append("<option value='" + value.vCodDepartamento + "' data-value='" + JSON.stringify(value.vCodDepartamento) + "'>" + value.vNomDepartamento + "</option>");
                $('#cbodepartamentoeval').append("<option value='" + value.vCodDepartamento + "' data-value='" + JSON.stringify(value.vCodDepartamento) + "'>" + value.vNomDepartamento + "</option>");                
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
                , iCodUbigeoT1: $("#cbodepartamento").val()
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
            { data: "iCodIdentificacion", title: "iCodIdentificacion", visible: false, orderable: false },
            { data: "vNombreSearT1", title: "iCodIdentificacion", visible: true, orderable: false },
            { data: "vEstado", title: "Estado", visible: true, orderable: false },
            {
                data: (row) => {
                    let acciones = `<div class="nav-actions">`;                    
                    acciones += `<a href="javascript:void(0);" onclick ="AsignarEvaluadores(this);"  data-toggle="tooltip" title="Asignar Evaluadores"><i class="fa fa-plus-circle" aria-hidden="true"></i></a>&nbsp;&nbsp;`;
                    acciones += `<a href="javascript:void(0);" onclick ="EliminarEvaluadores(this);"  data-toggle="tooltip" title="Eliminar Evaluadores"><i class="fa fa-trash" aria-hidden="true"></i></a>`;
                    acciones += `</div>`;
                    return acciones;
                }, title: "Acciones", visible: true, orderable: false
            }
        ]
    });


    $('#tblsears tbody').on('click', 'td.dt-control', function () {
        var tr = $(this).closest('tr');
        var row = general.tblsears.row(tr);

        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        } else {
            // Open this row
            row.child(format(row.data())).show();
            console.log(row.data());
            tr.addClass('shown');
            cargarDetalle(row.data().iCodIdentificacion);            
        }
    });

    $("#cbodepartamento").on('change', function (e) {
        general.tblsears.clear().draw();
    });

    $('#btneliminar').on('click', function () {
        let datos = {};
        //datos.iCodUbigeoT1 = $('#cbodepartamentoeval').val();
        datos.iCodIdentificacion = general.elementoSeleccionado.iCodIdentificacion;

        $.post(globals.urlWebApi + "api/AsignacionEvaluador/EliminarComiteEvaluadorPorIdentificacion", datos)
            .done((respuesta) => {
                if (respuesta.iCodComiteIdentificacion != 0) {
                    debugger;
                    general.tblsears.draw().clear();
                    $('#modaleliminar').modal('hide');
                    notif({
                        msg: "<b>Correcto:</b>" + respuesta.vMensaje,
                        type: "success"
                    });
                }
            });   
    });

    $('#btnasignar').on('click', function () {
        if ($('#cbodepartamentoeval').val() == '') {
            notif({
                msg: "<b>Incortecto:</b> Debe seleccionar Departamento",
                type: "error"
            });
            return;
        }

        let datos = {};

        datos.iCodUbigeoT1 = $('#cbodepartamentoeval').val();
        datos.iCodIdentificacion = general.elementoSeleccionado.iCodIdentificacion;

        $.post(globals.urlWebApi + "api/AsignacionEvaluador/AsignacionEvaluador", datos)
            .done((respuesta) => {
                if (respuesta.iCodComiteIdentificacion != 0) {
                    debugger;
                    general.tblsears.draw().clear();                    
                    $('#modalasignar').modal('hide');
                    notif({
                        msg: "<b>Correcto:</b>" + respuesta.vMensaje,
                        type: "success"
                    });
                }
            });        
    });

    $('#menuformulacion').addClass('is-expanded');
    //$('#submenuacreditacion').addClass('is-expanded');
    $('#subfichatecnica').addClass('is-expanded');
    $('#subitemmenu29').css('color', '#6c5ffc');
}

function format(d) {   
        let tabla = '<table id="tblevaluadores' + d.iCodIdentificacion + '" class="table table-bordered text-nowrap border-bottom dataTable" cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">' +
        '<tr class="table-success"><th>Apellidos y Nombres</th></tr>';            
        tabla = tabla + '</table>';                
           return (
                  tabla
            );
}
function cargarDetalle(iCodIdentifacion) {
    let datos = {};

    datos.iCodIdentificacion = iCodIdentifacion;

    $.post(globals.urlWebApi + "api/AsignacionEvaluador/ListarComiteEvaluadorPorIdentificacion", datos)
        .done((respuesta) => {
            if (respuesta.length > 0) {
                             
                $.each(respuesta, function (i, dato) {
                    //$("#" + i).append(document.createTextNode(" - " + val));
                    $('#tblevaluadores' + iCodIdentifacion).append('<tr><td>' + dato.vApellidoMat + ' ' + dato.vApellidoPat + ' ' + dato.vNombres + '</td></tr>');
                });
            }
        });
}

function AsignarEvaluadores(obj) {
    general.elementoSeleccionado = general.tblsears.row($(obj).parents('tr')).data();
    $('#modalasignar').modal({ backdrop: 'static', keyboard: false });
    $('#modalasignar').modal('show');     
}

function EliminarEvaluadores(obj) {
    general.elementoSeleccionado = general.tblsears.row($(obj).parents('tr')).data();
    $('#modaleliminar').modal({ backdrop: 'static', keyboard: false });
    $('#modaleliminar').modal('show');
}

    

    