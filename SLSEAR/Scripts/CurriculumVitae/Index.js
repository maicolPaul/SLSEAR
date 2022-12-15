let general = {
    iCodExtensionista: 0,
    iCodCurriculumVitae: 0,
    tblFormacion: null,
    tblexperiencia: null,
    tblExperienciaespecifica:null,
    elementoSeleccionado: null,
    accion: 1,
    usuario: 0,
    iTipoExperiencia:1
}

function EjecutarDetalleInformacionGeneral() {

    var arreglousuario = new Array();

    arreglousuario = $('#hdnusuario').val().split('|');

    general.usuario = arreglousuario[0];

    $('#cbonivel').empty();
    $('#cbonivel').append("<option value=''>Seleccione</option>");

    $.when( obtenerNivel({}))
        .done((niveles) => {            
            $.each(niveles, function (key, value) {                
                $('#cbonivel').append("<option value='" + value.iCodNivel + "' data-value='" + JSON.stringify(value.iCodNivel) + "'>" + value.vDescripcion + "</option>");
            });            
        });

    var file = { iCodExtensionista: parseInt(general.usuario), iCodNombreArchivo: 10 };

    $.post(globals.urlWebApi + "api/Archivo/ListarArchivo", file)
        .done((respuesta) => {
            //debugger;
            if (respuesta.length == 0) {
                $('#ahrefdescargar').attr('style', 'visibility:hidden');
                $('#ahrefeliminar').attr('style', 'visibility:hidden');
                $('#btncargarrequitos').removeAttr('disabled');
            } else {
                $('#btncargarrequitos').attr('disabled', 'disabled');
            }
        });

    var file1 = { iCodExtensionista: parseInt(general.usuario), iCodNombreArchivo: 11 };

    $.post(globals.urlWebApi + "api/Archivo/ListarArchivo", file1)
        .done((respuesta) => {
            //debugger;
            if (respuesta.length == 0) {
                $('#ahrefdescargar1').attr('style', 'visibility:hidden');
                $('#ahrefeliminar1').attr('style', 'visibility:hidden');
                $('#btncargarrequitos1').removeAttr('disabled');
            } else {
                $('#btncargarrequitos1').attr('disabled', 'disabled');
            }
        });

    var entidad = {};
    entidad.iCodExtensionista = general.usuario;
    $.post(globals.urlWebApi + "api/Extensionista/ListarExtensionistaPorCodigo", entidad)
        .done((respuesta) => {
            console.log(respuesta);
            if (respuesta.iCodExtensionista != 0) {
                $('#vNombres').val(respuesta.vNombres);
                $('#vApellidosPaterno').val(respuesta.vApepat);
                $('#vApellidosMaterno').val(respuesta.vApemat);
                $('#vDni').val(respuesta.vDni);
                $('#vRuc').val(respuesta.vRuc);
                $('#vCelular').val(respuesta.vCelular);
                $('#vDireccion').val(respuesta.vDomicilio);
                $('#vCorreo').val(respuesta.vCorreo);
                // grabar en CV  - inicio

                var entidad = {};
                entidad.iCodExtensionista = general.usuario;

                $.post(globals.urlWebApi + "api/CurriculumVitae/InsertarCurriculumVitae", entidad)
                    .done((respuesta) => {
                        console.log(respuesta);
                        if (respuesta.iCodCurriculumVitae != 0) {
                            general.iCodCurriculumVitae = respuesta.iCodCurriculumVitae;
                            general.tblFormacion.clear().draw();
                            general.tblexperiencia.clear().draw();
                            general.tblExperienciaespecifica.clear().draw();                            
                        }
                    }).fail((error) => {
                        console.log(error);
                    });

                // grabar en CV  - fin
            }            

        }).fail((error) => {
            console.log(error);
        });

    $('#btnagregar').on('click', function () {
        limpiar();
        general.accion = 1;
        $('#vDni').focus();
        $('#titulomodalproductor').html('Registrar Formación');
        $('#formacionmodal').modal({ backdrop: 'static', keyboard: false });
        $('#formacionmodal').modal('show');
    });

    $('#btnagregarexperiencia').on('click', function () {
        //limpiar();
        limpiarexperiencia();
        general.accion = 1;
        general.iTipoExperiencia = 1;

        //$('#vDni').focus();
        $('#titulomodalexperiencia').html('Registrar Experiencia');
        $('#experienciamodal').modal({ backdrop: 'static', keyboard: false });
        $('#experienciamodal').modal('show');
    });       

    $('#btnagregarexperienciaespecifica').on('click', function () {
        limpiarexperiencia();
        general.accion = 1;
        general.iTipoExperiencia = 2;
        $('#titulomodalexperiencia').html('Registrar Experiencia');
        $('#experienciamodal').modal({ backdrop: 'static', keyboard: false });
        $('#experienciamodal').modal('show');
    });

    $('#btnguardarformacionexperiencia').on('click', function () {
        //alert('guardo experiencia');
        //monthDiff(new Date($("#dFechaInicio").val()), new Date($("#dFechaFin").val()));
        //debugger;
        if ($("#vNombreEntidad").val().trim() == '') {
            $("#vNombreEntidad").focus();
               notif({
                         msg: "<b>Incorrecto:</b>Debe Ingresar Nombre Entidad",
                         type: "error"
               });
            return;
        }

        if ($("#vCargoServicio").val().trim() == '') {
            $("#vCargoServicio").focus();
            notif({
                msg: "<b>Incorrecto:</b>Debe Ingresar Cargo Servicio",
                type: "error"
            });
            return;
        }

        if ($("#vActividades").val().trim() == '') {
            $("#vActividades").focus();
            notif({
                msg: "<b>Incorrecto:</b>Debe Ingresar Actividades",
                type: "error"
            });
            return;
        }

        if ($("#vProductoServicio").val().trim() == '') {
            $("#vProductoServicio").focus();
            notif({
                msg: "<b>Incorrecto:</b>Debe Ingresar Producto Servicio",
                type: "error"
            });
            return;
        }

        if ($("#dFechaInicio").val().trim() == '') {
            $("#dFechaInicio").focus();
            notif({
                msg: "<b>Incorrecto:</b>Debe Seleccionar/ Ingresar Fecha Inicio",
                type: "error"
            });
            return;
        }

        if ($("#dFechaFin").val().trim() == '') {
            $("#dFechaFin").focus();
            notif({
                msg: "<b>Incorrecto:</b>Debe Seleccionar/ Ingresar Fecha Fin",
                type: "error"
            });
            return;
        }         

        var entidad = {};
        entidad.vNombreEntidad = $("#vNombreEntidad").val();
        entidad.vCargoServicio = $("#vCargoServicio").val();
        entidad.vActividades = $("#vActividades").val();
        entidad.vProductoServicio = $("#vProductoServicio").val();
        entidad.dFechaInicio = $("#dFechaInicio").val();
        entidad.dFechaFin = $("#dFechaFin").val();
        entidad.iCodCurriculumVitae = general.iCodCurriculumVitae;
        entidad.iCodExperiencia = 0;
        entidad.iOpcion = general.accion;
        entidad.iTipoExperiencia = general.iTipoExperiencia;

        if (general.accion == 2) {
            entidad.iCodExperiencia = general.elementoSeleccionado.iCodExperiencia;
        }

        $.post(globals.urlWebApi + "api/Experiencia/InsertarExperiencia", entidad)
            .done((respuesta) => {
                console.log(respuesta);
                if (respuesta.iCodExperiencia != 0) {
                    notif({
                        msg: "<b>Correcto:</b> se ha grabado correctamente",
                        type: "success"
                    });
                    $('#experienciamodal').modal('hide');
                    if (general.iTipoExperiencia == 1) {
                        general.tblexperiencia.clear().draw();
                    } else {
                        general.tblExperienciaespecifica.clear().draw();
                    }                    
                }

            }).fail((error) => {
                console.log(error);
            });
    });

    $('#btnguardarformacion').on('click', function () {
        var entidad = {};
        entidad.iCodExtensionista = general.usuario;

        if ($("#cbonivel").val() == '') {
            notif({
                msg: "<b>Correcto:</b> debe seleccionar nivel",
                type: "error"
            });
            return;
        }

        if ($("#vCentroEstudios").val().trim() == '') {
            notif({
                msg: "<b>Correcto:</b>se debe ingresar centro de estudios",
                type: "error"
            });
            return;
        }

        if ($("#vEspecialidad").val().trim() == '') {
            notif({
                msg: "<b>Correcto:</b>se debe ingresar especialidad",
                type: "error"
            });
            return;
        }


        entidad.iCodNivel = $("#cbonivel").val();
        entidad.vCentroEstudios = $("#vCentroEstudios").val();
        entidad.vEspecialidad = $("#vEspecialidad").val();        

        if (general.accion == 2) {
            entidad.iCodFormacionAcademica = general.elementoSeleccionado.iCodFormacionAcademica;
        }        

        entidad.iOpcion = general.accion;

        if (general.iCodCurriculumVitae != 0) {
            entidad.iCodCurriculumVitae = general.iCodCurriculumVitae;

            $.post(globals.urlWebApi + "api/FormacionAcademica/InsertarFormacionAcademica", entidad)
                .done((respuesta) => {
                    console.log(respuesta);
                    if (respuesta.iCodFormacionAcademica != 0) {
                        notif({
                            msg: "<b>Correcto:</b> se ha grabado correctamente",
                            type: "success"
                        });
                        $('#formacionmodal').modal('hide');                        
                        general.tblFormacion.clear().draw();
                    }

                }).fail((error) => {
                    console.log(error);
                });
        }        
    });

    $('#btneliminarformacion').on('click', function () {
        var entidad = {};
        entidad.iOpcion = geneRAL.accion;
        entidad.iCodFormacionAcademica = general.elementoSeleccionado.iCodFormacionAcademica;

        $.post(globals.urlWebApi + "api/FormacionAcademica/InsertarFormacionAcademica", entidad)
            .done((respuesta) => {
                console.log(respuesta);
                if (respuesta.iCodFormacionAcademica != 0) {
                    notif({
                        msg: "<b>Correcto:</b> se ha grabado correctamente",
                        type: "success"
                    });
                    $('#modaleliminarformacion').modal('hide');
                    general.tblFormacion.clear().draw();
                }

            }).fail((error) => {
                console.log(error);
            });
    });

    $('#btneliminarexperiencia').on('click',function(){                
        var entidad = {};
        entidad.iCodExperiencia = general.elementoSeleccionado.iCodExperiencia;
        entidad.iOpcion = general.accion;
        $.post(globals.urlWebApi + "api/Experiencia/InsertarExperiencia", entidad)
            .done((respuesta) => {
                console.log(respuesta);
                if (respuesta.iCodExperiencia != 0) {
                    notif({
                        msg: "<b>Correcto:</b> se ha grabado correctamente",
                        type: "success"
                    });
                    $('#modaleliminarexperiencia').modal('hide');
                    if (general.iTipoExperiencia == 1) {
                        general.tblexperiencia.clear().draw();
                    } else {
                        general.tblExperienciaespecifica.clear().draw();
                    }                    
                }

            }).fail((error) => {
                console.log(error);
            });
    })
    
    general.tblexperiencia = $("#tblExperiencia").DataTable({
        bFilter: false
        , serverSide: true
        , searching: false
        , lengthChange: true
        , paging: true
        , autoWidth: false
        , processing: true        
        , drawCallback: function () {
            $('#tblExperiencia thead').attr('class', 'table-success');           
        }
        , language: globals.lenguajeDataTable
        , ajax: function (data, callback, settings) {
            let paginaActual = 1 + (parseInt(settings._iDisplayStart) / parseInt(settings._iDisplayLength));
            let parametro = {
                piPageSize: parseInt(settings._iDisplayLength)
                , piCurrentPage: paginaActual
                , pvSortColumn: "iCodExperiencia"
                , pvSortOrder: "asc"
                , iCodExtensionista: general.usuario
                , iCodCurriculumVitae: general.iCodCurriculumVitae
                , iTipoExperiencia : 1
            };
            $.ajax({
                type: "POST",
                url: globals.urlWebApi + "api/Experiencia/ListarExperiencia",
                headers: { Accept: "application/json" /*, Authorization: `Bearer ${globals.sesion.token}`*/ },
                dataType: 'json',
                data: parametro
            })
                .done(function (data) {
                    //debugger;
                    callback({
                        data: data,
                        recordsTotal: data.length !== 0 ? data[0].totalRegistros : 0,
                        recordsFiltered: data.length !== 0 ? data[0].totalRegistros : 0
                    });

                    if (general.tblexperiencia.data().length > 0) {
                        console.log('anios');
                        //debugger;
                        console.log(general.tblexperiencia.data()[0].totalmeses);
                        var parteenteraanios = parseInt(general.tblexperiencia.data()[0].totalmeses / 12);
                        var partedecimal = (general.tblexperiencia.data()[0].totalmeses / 12) - parteenteraanios;
                        $('#anios').val(parteenteraanios);
                        $('#meses').val(parseInt(partedecimal / 0.08333333));
                    }
                })
                .fail(function (error) {
                    console.log(error);
                    cuandoAjaxFalla(error.status);
                });
        }
        , columns: [            
            { data: "iCodExperiencia", title: "iCodExperiencia", visible: false, orderable: false },
            { data: "vNombreEntidad", title: "Nombre Entidad", visible: true, orderable: false },
            { data: "vCargoServicio", title: "Cargo Servicio", visible: true, orderable: false },
            { data: "vActividades", title: "Actividades", visible: true, orderable: false },
            { data: "vProductoServicio", title: "Producto Servicio", visible: true, orderable: false },
            { data: "dFechaInicio", title: "Fecha Inicio", visible: true, orderable: false },
            { data: "dFechaFin", title: "Fecha Fin", visible: true, orderable: false },
            { data: "meses", title: "Meses", visible: true, orderable: false },
            { data: "totalmeses", title: "totalmeses", visible: false, orderable: false },
            {
                data: (row) => {
                    let acciones = `<div class="nav-actions">`;                    
                    acciones += `<a href="javascript:void(0);" onclick ="Editarexperiencia(this,1);" class="tooltipped" data-position="left" data-delay="50" data-tooltip="Editar"><i class="bi bi-pencil"></i></a>&nbsp&nbsp&nbsp`;                    
                    acciones += `<a href="javascript:void(0);" onclick ="eliminarexperiencia(this,1);" class="tooltipped" data-position="left" data-delay="50" data-tooltip="Eliminar"><i class="bi bi-trash-fill"></i></a>`;                    
                    acciones += `</div>`;
                    return acciones;
                }, title: "Acciones", visible: true, orderable: false
            }
        ]
    });
       //tblExperienciaespecifica
    general.tblExperienciaespecifica = $("#tblExperienciaespecifica").DataTable({
        bFilter: false
        , serverSide: true
        , searching: false
        , lengthChange: true
        , paging: true
        , autoWidth: false
        , processing: true
        , drawCallback: function () {
            $('#tblExperienciaespecifica thead').attr('class', 'table-success');
        }
        , language: globals.lenguajeDataTable
        , ajax: function (data, callback, settings) {
            let paginaActual = 1 + (parseInt(settings._iDisplayStart) / parseInt(settings._iDisplayLength));
            let parametro = {
                piPageSize: parseInt(settings._iDisplayLength)
                , piCurrentPage: paginaActual
                , pvSortColumn: "iCodExperiencia"
                , pvSortOrder: "asc"
                , iCodExtensionista: general.usuario
                , iCodCurriculumVitae: general.iCodCurriculumVitae
                , iTipoExperiencia: 2
            };
            $.ajax({
                type: "POST",
                url: globals.urlWebApi + "api/Experiencia/ListarExperiencia",
                headers: { Accept: "application/json" /*, Authorization: `Bearer ${globals.sesion.token}`*/ },
                dataType: 'json',
                data: parametro
            })
                .done(function (data) {
                    //debugger;
                    callback({
                        data: data,
                        recordsTotal: data.length !== 0 ? data[0].totalRegistros : 0,
                        recordsFiltered: data.length !== 0 ? data[0].totalRegistros : 0
                    });

                    if (general.tblExperienciaespecifica.data().length > 0) {
                        console.log('anios');
                        //debugger;
                        console.log(general.tblExperienciaespecifica.data()[0].totalmeses);
                        var parteenteraanios = parseInt(general.tblExperienciaespecifica.data()[0].totalmeses / 12);
                        var partedecimal = (general.tblExperienciaespecifica.data()[0].totalmeses / 12) - parteenteraanios;
                        $('#anios1').val(parteenteraanios);
                        $('#meses1').val(parseInt(partedecimal / 0.08333333));
                    }
                })
                .fail(function (error) {
                    console.log(error);
                    cuandoAjaxFalla(error.status);
                });
        }
        , columns: [
            { data: "iCodExperiencia", title: "iCodExperiencia", visible: false, orderable: false },
            { data: "vNombreEntidad", title: "Nombre Entidad", visible: true, orderable: false },
            { data: "vCargoServicio", title: "Cargo Servicio", visible: true, orderable: false },
            { data: "vActividades", title: "Actividades", visible: true, orderable: false },
            { data: "vProductoServicio", title: "Producto Servicio", visible: true, orderable: false },
            { data: "dFechaInicio", title: "Fecha Inicio", visible: true, orderable: false },
            { data: "dFechaFin", title: "Fecha Fin", visible: true, orderable: false },
            { data: "meses", title: "Meses", visible: true, orderable: false },
            { data: "totalmeses", title: "totalmeses", visible: false, orderable: false },
            {
                data: (row) => {
                    let acciones = `<div class="nav-actions">`;                    
                    acciones += `<a href="javascript:void(0);" onclick ="Editarexperiencia(this,2);" class="tooltipped" data-position="left" data-delay="50" data-tooltip="Editar"><i class="bi bi-pencil"></i></a>&nbsp&nbsp&nbsp`;                    
                    acciones += `<a href="javascript:void(0);" onclick ="eliminarexperiencia(this,2);" class="tooltipped" data-position="left" data-delay="50" data-tooltip="Eliminar"><i class="bi bi-trash-fill"></i></a>`;                    
                    acciones += `</div>`;
                    return acciones;
                }, title: "Acciones", visible: true, orderable: false
            }
        ]
    });

    general.tblFormacion = $("#tblFormacion").DataTable({
        bFilter: false
        , serverSide: true
        , searching: false
        , lengthChange: true
        , paging: true
        , autoWidth: false
        , processing: true
        //, dom: 'tr<"footer"l<"paging-info valign-wrapper"ip>>'
        , drawCallback: function () {
            $('#tblFormacion thead').attr('class', 'table-success');
            //$('select[name="tblComunidadOpa_length"]').formSelect();
            //$('.tooltipped').tooltip();
        }
        , language: globals.lenguajeDataTable
        , ajax: function (data, callback, settings) {
            let paginaActual = 1 + (parseInt(settings._iDisplayStart) / parseInt(settings._iDisplayLength));            
            let parametro = {
                piPageSize: parseInt(settings._iDisplayLength)
                , piCurrentPage: paginaActual
                , pvSortColumn: "iCodFormacionAcademica"
                , pvSortOrder: "asc"
                , iCodExtensionista: general.usuario
                , iCodCurriculumVitae: general.iCodCurriculumVitae
            };       
            $.ajax({
                type: "POST",
                url: globals.urlWebApi + "api/FormacionAcademica/ListarFormacionAcademica",
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
            { data: "iCodFormacionAcademica", title: "iCodFormacionAcademica", visible: false, orderable: false },
            { data: "descripcionnivel", title: "Nivel", visible: true, orderable: false },
            { data: "vCentroEstudios", title: "Centro de Estudios", visible: true, orderable: false },
            { data: "vEspecialidad", title: "Especialidad", visible: true, orderable: false },                  
            {
                data: (row) => {
                    let acciones = `<div class="nav-actions">`;                    
                    acciones += `<a href="javascript:void(0);" onclick ="Editarformacio(this);" class="tooltipped" data-position="left" data-delay="50" data-tooltip="Editar"><i class="bi bi-pencil"></i></a>&nbsp&nbsp&nbsp`;                    
                    acciones += `<a href="javascript:void(0);" onclick ="eliminarformacion(this);" class="tooltipped" data-position="left" data-delay="50" data-tooltip="Eliminar"><i class="bi bi-trash-fill"></i></a>`;                    
                    acciones += `</div>`;
                    return acciones;
                }, title: "Acciones", visible: true, orderable: false
            }
        ]
    });

    $("#ahrefdescargar").on('click', function () {
        //debugger;
        var file = { iCodExtensionista: general.usuario, iCodNombreArchivo: 10 };

        $.post(globals.urlWebApi + "api/Archivo/ListarArchivo", file)
            .done((respuesta) => {
                var parametrosdescarga = { path: respuesta[0].vRutaArchivo };
                openData('POST', globals.urlWebApi + "api/Archivo/DescargarArchivoFile", parametrosdescarga, '_blank');
            });
    });

    $("#ahrefdescargar1").on('click', function () {
        //debugger;
        var file = { iCodExtensionista: general.usuario, iCodNombreArchivo: 11 };

        $.post(globals.urlWebApi + "api/Archivo/ListarArchivo", file)
            .done((respuesta) => {
                var parametrosdescarga = { path: respuesta[0].vRutaArchivo };
                openData('POST', globals.urlWebApi + "api/Archivo/DescargarArchivoFile", parametrosdescarga, '_blank');
            });
    });

    $('#ahrefeliminar').on('click', function () {
        var file = { iCodExtensionista: general.usuario, iCodNombreArchivo: 10 };
        $.post(globals.urlWebApi + "api/Archivo/EliminarArchivo", file)
            .done((respuesta) => {
                if (respuesta.iCodArchivos == 1) {
                    $('#ahrefdescargar').attr('style', 'visibility:hidden');
                    $('#ahrefeliminar').attr('style', 'visibility:hidden');
                    $('#btncargarrequitos').removeAttr('disabled');
                    notif({
                        msg: "<b>Correcto:</b>" + respuesta.vMensaje,
                        type: "success"
                    });
                }
            });
    });

    $('#ahrefeliminar1').on('click', function () {
        var file = { iCodExtensionista: general.usuario, iCodNombreArchivo: 11 };
        $.post(globals.urlWebApi + "api/Archivo/EliminarArchivo", file)
            .done((respuesta) => {
                if (respuesta.iCodArchivos == 1) {
                    $('#ahrefdescargar1').attr('style', 'visibility:hidden');
                    $('#ahrefeliminar1').attr('style', 'visibility:hidden');
                    $('#btncargarrequitos1').removeAttr('disabled');
                    notif({
                        msg: "<b>Correcto:</b>" + respuesta.vMensaje,
                        type: "success"
                    });
                }
            });
    });

    $('#file').on('change', function () {
        var fileInput = document.getElementById('file');
        var filePath = fileInput.value;
        var allowedExtensions = /(.pdf)$/i;
        if (!allowedExtensions.exec(filePath)) {
            notif({
                msg: "<b>Incorrecto:</b> Solo se Permite Archivos Pdf",
                type: "error"
            });
            fileInput.value = '';
            return false;
        } else {
            return true;
            //Image preview
            //if (fileInput.files && fileInput.files[0]) {
            //    var reader = new FileReader();
            //    reader.onload = function (e) {
            //        document.getElementById('imagePreview').innerHTML = '<img src="' + e.target.result + '"/>';
            //    };
            //    reader.readAsDataURL(fileInput.files[0]);
            //}
        }
    });
    $('#file1').on('change', function () {
        var fileInput = document.getElementById('file1');
        var filePath = fileInput.value;
        var allowedExtensions = /(.pdf)$/i;
        if (!allowedExtensions.exec(filePath)) {
            notif({
                msg: "<b>Incorrecto:</b> Solo se Permite Archivos Pdf",
                type: "error"
            });
            fileInput.value = '';
            return false;
        } else {
            return true;
            //Image preview
            //if (fileInput.files && fileInput.files[0]) {
            //    var reader = new FileReader();
            //    reader.onload = function (e) {
            //        document.getElementById('imagePreview').innerHTML = '<img src="' + e.target.result + '"/>';
            //    };
            //    reader.readAsDataURL(fileInput.files[0]);
            //}
        }
    });
    $('#btncargarrequitos').on('click', function (e) {

        if ($("#file").get(0).files.length > 0) {
            loadshow();
            var files = $("#file").get(0).files;
            var fileData = new FormData();

            fileData.append("file", files[0]);
            fileData.append("path", "SLSEAR\\");
            fileData.append("icodExtensionista", general.usuario);
            fileData.append("vRutaArchivo", files[0].name);
            fileData.append("iCodNombreArchivo", 10);
            $.ajax({
                type: "POST",
                url: globals.urlInsertarArchivo,
                contentType: false,
                processData: false,
                data: fileData,
                success: function (result, status, xhr) {
                    //alert(result);
                    loadhide();
                    $('#file').val('');
                    $('#ahrefdescargar').removeAttr('style');
                    $('#ahrefeliminar').removeAttr('style');
                    $('#btncargarrequitos').attr('disabled', 'disabled');
                    notif({
                        msg: "<b>Correcto:</b> Se Cargo Documento Correctamente",
                        type: "success"
                    });
                },
                error: function (xhr, status, error) {
                    alert(status);
                }
            });
        } else {
            notif({
                msg: "<b>Incorrecto:</b> Debe Adjuntar Archivo",
                type: "error"
            });
        }
    });

    $('#btncargarrequitos1').on('click', function (e) {

        if ($("#file1").get(0).files.length > 0) {
            loadshow();
            var files = $("#file1").get(0).files;
            var fileData = new FormData();

            fileData.append("file", files[0]);
            fileData.append("path", "SLSEAR\\");
            fileData.append("icodExtensionista", general.usuario);
            fileData.append("vRutaArchivo", files[0].name);
            fileData.append("iCodNombreArchivo", 11);
            $.ajax({
                type: "POST",
                url: globals.urlInsertarArchivo,
                contentType: false,
                processData: false,
                data: fileData,
                success: function (result, status, xhr) {
                    //alert(result);
                    loadhide();
                    $('#file1').val('');
                    $('#ahrefdescargar1').removeAttr('style');
                    $('#ahrefeliminar1').removeAttr('style');
                    $('#btncargarrequitos1').attr('disabled', 'disabled');
                    notif({
                        msg: "<b>Correcto:</b> Se Cargo Documento Correctamente",
                        type: "success"
                    });
                },
                error: function (xhr, status, error) {
                    alert(status);
                }
            });
        } else {
            notif({
                msg: "<b>Incorrecto:</b> Debe Adjuntar Archivo",
                type: "error"
            });
        }
    });

    cargarusuario(14);

    //$('#menuformulacion').addClass('is-expanded');
    //$('#submenuacreditacion').addClass('is-expanded');
    //$('#subitemmenu4').css('color', '#6c5ffc');

    $('#dFechaInicio').on('blur', function () {        
        if ($('#dFechaInicio').val() != "" && $('#dFechaFin').val() != "") {
            var meses = monthDiff(new Date($('#dFechaInicio').val()), new Date($('#dFechaFin').val()));
            $('#txtduracionmeses').val(meses);
        }        
    });
    $('#dFechaFin').on('blur', function () {
        if ($('#dFechaInicio').val() != "" && $('#dFechaFin').val() != "") {
            var meses =monthDiff(new Date($('#dFechaInicio').val()), new Date($('#dFechaFin').val()));
            $('#txtduracionmeses').val(meses);
        }
    });

    $('#dFechaInicio').on('change', function () {
        console.log('change');
        console.log(this.value);
        if ($('#dFechaInicio').val() != "" && $('#dFechaFin').val() != "") {
            var meses = monthDiff(new Date($('#dFechaInicio').val()), new Date($('#dFechaFin').val()));
            $('#txtduracionmeses').val(meses);
        }        

    });

    $('#dFechaFin').on('change', function () {
        console.log('change');
        console.log(this.value);
        if ($('#dFechaInicio').val() != "" && $('#dFechaFin').val() != "") {
            var meses = monthDiff(new Date($('#dFechaInicio').val()), new Date($('#dFechaFin').val()));
            $('#txtduracionmeses').val(meses);
        }
    });
}

function Editarexperiencia(obj,op) {
    //debugger;
    general.accion = 2;
    general.iTipoExperiencia = op;
    if (op == 1) {
        general.elementoSeleccionado = general.tblexperiencia.row($(obj).parents('tr')).data();
    } else {
        general.elementoSeleccionado = general.tblExperienciaespecifica.row($(obj).parents('tr')).data();
    }
    
    console.log(general.elementoSeleccionado);
    $('#vNombreEntidad').val(general.elementoSeleccionado.vNombreEntidad);
    $('#vCargoServicio').val(general.elementoSeleccionado.vCargoServicio);
    $('#vActividades').val(general.elementoSeleccionado.vActividades);
    $('#vProductoServicio').val(general.elementoSeleccionado.vProductoServicio);
        
    var dfechainicio = new Array();

    dfechainicio = general.elementoSeleccionado.dFechaInicio.split("/");

    $('#dFechaInicio').val(dfechainicio[2] + "-" + dfechainicio[1] + "-" + dfechainicio[0]);

    var dFechaFin = new Array();

    dFechaFin = general.elementoSeleccionado.dFechaFin.split("/");

    $('#dFechaFin').val(dFechaFin[2] + "-" + dFechaFin[1] + "-" + dFechaFin[0]);
    $('#dFechaFin').trigger('change');
    $('#titulomodalexperiencia').html('Editar Experiencia');
    $('#experienciamodal').modal({ backdrop: 'static', keyboard: false });
    $('#experienciamodal').modal('show');
}

function monthDiff(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    console.log(months);
    return months <= 0 ? 0 : months;
}

function obtenerNivel(data) {
    return $.ajax({ type: "POST", url: globals.urlListarNivel, headers: { Accept: "application/json"/*, Authorization: `Bearer ${globals.sesion.token}`*/ }, dataType: 'json', data: data });
}
function limpiar() {
    $("#cbonivel").val('');
    $("#vCentroEstudios").val('');
    $("#vEspecialidad").val('');
}

function limpiarexperiencia() {
    $('#vNombreEntidad').val('');
    $('#vCargoServicio').val('');
    $('#vActividades').val('');
    $('#vProductoServicio').val('');
    $('#dFechaInicio').val('');
    $('#dFechaFin').val('');
}

function Editarformacio(obj) {
    general.accion = 2;
    limpiar();
    general.elementoSeleccionado = general.tblFormacion.row($(obj).parents('tr')).data();
    $("#cbonivel").val(general.elementoSeleccionado.iCodNivel);
    $("#vCentroEstudios").val(general.elementoSeleccionado.vCentroEstudios);
    $("#vEspecialidad").val(general.elementoSeleccionado.vEspecialidad);
    
    $('#vDni').focus();
    $('#titulomodalproductor').html('Editar Formación');
    $('#formacionmodal').modal({ backdrop: 'static', keyboard: false });
    $('#formacionmodal').modal('show');
}

function eliminarformacion(obj) {
    general.accion = 3;
    general.elementoSeleccionado = general.tblFormacion.row($(obj).parents('tr')).data();
    $('#titulomodalproductor').html('Eliminar Registro');
    $('#modaleliminarformacion').modal({ backdrop: 'static', keyboard: false });
    $('#modaleliminarformacion').modal('show');    
}

function eliminarexperiencia(obj, op) {
    general.iTipoExperiencia = op;
    general.accion = 3;

    general.iTipoExperiencia = op;
    if (op == 1) {
        general.elementoSeleccionado = general.tblexperiencia.row($(obj).parents('tr')).data();
    } else {
        general.elementoSeleccionado = general.tblExperienciaespecifica.row($(obj).parents('tr')).data();
    }
    //$('#titulomodalproductor').html('Eliminar Registro');
    $('#modaleliminarexperiencia').modal({ backdrop: 'static', keyboard: false });
    $('#modaleliminarexperiencia').modal('show');    
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