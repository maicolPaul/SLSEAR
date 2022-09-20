
(function ($) {
    "use strict";

    // ______________ PAGE LOADING
    $(window).on("load", function (e) {
        $("#global-loader").fadeOut("slow");
    })

    //Color-Theme
    $(document).on("click", "a[data-theme]", function () {
        $("head link#theme").attr("href", $(this).data("theme"));
        $(this).toggleClass('active').siblings().removeClass('active');
    });

    // ______________Full screen
    $(document).on("click", ".fullscreen-button", function toggleFullScreen() {
        $('.fullscreen-button').addClass('fullscreen-button');
        if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) || (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) || (document.mozFullScreen !== undefined && !document.mozFullScreen) || (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)) {
            if (document.documentElement.requestFullScreen) {
                document.documentElement.requestFullScreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullScreen) {
                document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
            } else if (document.documentElement.msRequestFullscreen) {
                document.documentElement.msRequestFullscreen();
            }
        } else {
            $('html').removeClass('fullscreen-button');
            if (document.cancelFullScreen) {
                document.cancelFullScreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    })

    // ______________ BACK TO TOP BUTTON
    $(window).on("scroll", function (e) {
        if ($(this).scrollTop() > 0) {
            $('#back-to-top').fadeIn('slow');
        } else {
            $('#back-to-top').fadeOut('slow');
        }
    });
    $(document).on("click", "#back-to-top", function (e) {
        $("html, body").animate({
            scrollTop: 0
        }, 0);
        return false;
    });


    // ______________ COVER IMAGE
    $(".cover-image").each(function () {
        var attr = $(this).attr('data-bs-image-src');
        if (typeof attr !== typeof undefined && attr !== false) {
            $(this).css('background', 'url(' + attr + ') center center');
        }
    });

    // ______________Quantity Cart Increase & Descrease
    $(function () {
        $('.add').on('click', function () {
            var $qty = $(this).closest('div').find('.qty');
            var currentVal = parseInt($qty.val());
            if (!isNaN(currentVal)) {
                $qty.val(currentVal + 1);
            }
        });
        $('.minus').on('click', function () {
            var $qty = $(this).closest('div').find('.qty');
            var currentVal = parseInt($qty.val());
            if (!isNaN(currentVal) && currentVal > 0) {
                $qty.val(currentVal - 1);
            }
        });
    });

    // ______________Chart-circle
    if ($('.chart-circle').length) {
        $('.chart-circle').each(function () {
            let $this = $(this);
            $this.circleProgress({
                fill: {
                    color: $this.attr('data-bs-color')
                },
                size: $this.height(),
                startAngle: -Math.PI / 4 * 2,
                emptyFill: '#edf0f5',
                lineCap: 'round'
            });
        });
    }

    // __________MODAL
    // showing modal with effect
    $('.modal-effect').on('click', function (e) {
        e.preventDefault();
        var effect = $(this).attr('data-bs-effect');
        $('#modaldemo8').addClass(effect);
    });
    // hide modal with effect
    $('#modaldemo8').on('hidden.bs.modal', function (e) {
        $(this).removeClass(function (index, className) {
            return (className.match(/(^|\s)effect-\S+/g) || []).join(' ');
        });
    });

    // ______________ CARD
    const DIV_CARD = 'div.card';

    // ___________TOOLTIP
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })

    // __________POPOVER
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl)
    })
    // By default, Bootstrap doesn't auto close popover after appearing in the page
    $(document).on('click', function (e) {
        $('[data-toggle="popover"],[data-original-title]').each(function () {
            //the 'is' for buttons that trigger popups
            //the 'has' for icons within a button that triggers a popup
            if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                (($(this).popover('hide').data('bs.popover') || {}).inState || {}).click = false // fix for BS 3.3.6
            }

        });
    });

    // ______________ Toast
    var toastElList = [].slice.call(document.querySelectorAll('.toast'))
    var toastList = toastElList.map(function (toastEl) {
        return new bootstrap.Toast(toastEl)
    })
    $("#liveToastBtn").click(function () {
        $('.toast').toast('show');
    })

    // ______________ FUNCTION FOR REMOVE CARD
    $(document).on('click', '[data-bs-toggle="card-remove"]', function (e) {
        let $card = $(this).closest(DIV_CARD);
        $card.remove();
        e.preventDefault();
        return false;
    });


    // ______________ FUNCTIONS FOR COLLAPSED CARD
    $(document).on('click', '[data-bs-toggle="card-collapse"]', function (e) {
        let $card = $(this).closest(DIV_CARD);
        $card.toggleClass('card-collapsed');
        e.preventDefault();
        return false;
    });

    // ______________ CARD FULL SCREEN
    $(document).on('click', '[data-bs-toggle="card-fullscreen"]', function (e) {
        let $card = $(this).closest(DIV_CARD);
        $card.toggleClass('card-fullscreen').removeClass('card-collapsed');
        e.preventDefault();
        return false;
    });


    //Input file-browser
    $(document).on('change', '.file-browserinput', function () {
        var input = $(this),
            numFiles = input.get(0).files ? input.get(0).files.length : 1,
            label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
        input.trigger('fileselect', [numFiles, label]);
    }); // We can watch for our custom `fileselect` event like this

    //______File Upload
    $('.file-browserinput').on('fileselect', function (event, numFiles, label) {
        var input = $(this).parents('.input-group').find(':text'),
            log = numFiles > 1 ? numFiles + ' files selected' : label;
        if (input.length) {
            input.val(log);
        } else {
            if (log) alert(log);
        }
    });



    // ______________Accordion Style
    $(document).on("click", '[data-bs-toggle="collapse"]', function () {
        $(this).toggleClass('active').siblings().removeClass('active');
    });


})(jQuery);

function replay() {
    let replayButtom = document.querySelectorAll('.reply a')
    // Creating Div
    let Div = document.createElement('div')
    Div.setAttribute('class', "comment mt-5 d-grid")
    // creating textarea
    let textArea = document.createElement('textarea')
    textArea.setAttribute('class', "form-control")
    textArea.setAttribute('rows', "5")
    textArea.innerText = "Your Comment";
    // creating Cancel buttons
    let cancelButton = document.createElement('button');
    cancelButton.setAttribute('class', "btn btn-danger");
    cancelButton.innerText = "Cancel";

    let buttonDiv = document.createElement('div')
    buttonDiv.setAttribute('class', "btn-list ms-auto mt-2")

    // Creating submit button
    let submitButton = document.createElement('button');
    submitButton.setAttribute('class', "btn btn-success ms-3");
    submitButton.innerText = "Submit";

    // appending text are to div
    Div.append(textArea)
    Div.append(buttonDiv);
    buttonDiv.append(cancelButton);
    buttonDiv.append(submitButton);

    replayButtom.forEach((element, index) => {

        element.addEventListener('click', () => {
            let replay = $(element).parent()
            replay.append(Div)

            cancelButton.addEventListener('click', () => {
                Div.remove()
            })
        })
    })


}
replay()

function like() {
    let like = document.querySelectorAll('.like')

    like.forEach((element, index) => {
        element.addEventListener('click', () => {
            let likeText = $(element).children()
            console.log(Number(likeText[0].childNodes[2]))
            // likeText.innerText++
        })
    })
}

like()


//Email Inbox
jQuery(document).ready(function ($) {
    $(".clickable-row").click(function () {
        window.location = $(this).data("href");
    });
});

/*off canvas Style*/
$('.off-canvas').on('click', function () {
    $('body').addClass('overflow-y-scroll');
    $('body').addClass('pe-0');
});

$('.layout-setting').on("click", function (e) {
    if (document) {
        $('body').toggleClass('dark-mode');
        $('body').removeClass('transparent-mode');
    } else {
        $('body').removeClass('dark-mode');
        $('body').removeClass('transparent-mode');
        $('body').addClass('light-mode');
    }
});



//######## SWITCHER STYLES ######## //


// Sidemenu layout Styles //

// ***** Icon with Text *****//
// $('body').addClass('icontext-menu');
// $('body').addClass('sidenav-toggled');
// if(document.querySelector('.icontext-menu').firstElementChild.classList.contains('login-img') !== true){
// icontext();
// }

// ***** Icon Overlay ***** //
// $('body').addClass('icon-overlay');
// $('body').addClass('sidenav-toggled');

// ***** closed-leftmenu ***** //
// $('body').addClass('closed-leftmenu');
// $('body').addClass('sidenav-toggled')

// ***** hover-submenu ***** //
// $('body').addClass('hover-submenu');
// $('body').addClass('sidenav-toggled')
// if(document.querySelector('.hover-submenu').firstElementChild.classList.contains('login-img') !== true){
// hovermenu();
// }

// ***** hover-submenu style 1 ***** //
// $('body').addClass('hover-submenu1');
// $('body').addClass('sidenav-toggled')
// if(document.querySelector('.hover-submenu1').firstElementChild.classList.contains('login-img') !== true){
// hovermenu();
// }


/******** *Header-Position Styles Start* ********/

// $('body').addClass('fixed-layout');
// $('body').addClass('scrollable-layout');


/******* Full Width Layout Start ********/

// $('body').addClass('layout-fullwidth');
// $('body').addClass('layout-boxed');


/******* Header Styles ********/

// $('body').addClass('header-light');
// $('body').addClass('color-header');
// $('body').addClass('dark-header');
// $('body').addClass('gradient-header');

/******* Menu Styles ********/

// $('body').addClass('light-menu');
// $('body').addClass('color-menu');
// $('body').addClass('dark-menu');
// $('body').addClass('gradient-menu');


/******* Theme Style ********/

// $('body').addClass('light-mode');
// $('body').addClass('dark-mode');
// $('body').addClass('transparent-mode');

/******* RTL VERSION *******/

// $('body').addClass('rtl');

$(document).ready(function () {
    let bodyRtl = $('body').hasClass('rtl');
    if (bodyRtl) {
        $('body').addClass('rtl');
        $("html[lang=en]").attr("dir", "rtl");
        $('body').removeClass('ltr');
        localStorage.setItem("rtl", "True");
        $("head link#style").attr("href", $(this));
        (document.getElementById("style").setAttribute("href", "../assets/plugins/bootstrap/css/bootstrap.rtl.min.css"));
        var carousel = $('.owl-carousel');
        $.each(carousel, function (index, element) {
            // element == this
            var carouselData = $(element).data('owl.carousel');
            carouselData.settings.rtl = true; //don't know if both are necessary
            carouselData.options.rtl = true;
            $(element).trigger('refresh.owl.carousel');
        });
    }
});


/******* Navigation Style *******/

// ***** Horizontal Click Menu ***** //

// $('body').addClass('horizontal');


$(document).ready(function () {
    let bodyhorizontal = $('body').hasClass('horizontal');
    if (bodyhorizontal) {
        $('body').addClass('horizontal');
        $(".main-content").addClass("hor-content");
        $(".main-content").removeClass("app-content");
        $(".main-container").addClass("container");
        $(".main-container").removeClass("container-fluid");
        $(".app-header").addClass("hor-header");
        $(".hor-header").removeClass("app-header");
        $(".app-sidebar").addClass("horizontal-main")
        $(".main-sidemenu").addClass("container")
        $('body').removeClass('sidebar-mini');
        $('body').removeClass('sidenav-toggled');
        $('body').removeClass('horizontal-hover');
        $('body').removeClass('default-menu');
        $('body').removeClass('icontext-menu');
        $('body').removeClass('icon-overlay');
        $('body').removeClass('closed-leftmenu');
        $('body').removeClass('hover-submenu');
        $('body').removeClass('hover-submenu1');
        localStorage.setItem("horizantal", "True");
        // $('#slide-left').addClass('d-none');
        // $('#slide-right').addClass('d-none');
        $('#slide-left').removeClass('d-none');
        $('#slide-right').removeClass('d-none');
        if (document.querySelector('.horizontal').firstElementChild.classList.contains('login-img') !== true) {
            document.querySelector('.horizontal .side-menu').style.flexWrap = 'nowrap'
            menuClick();
            checkHoriMenu();
            responsive();
        }
    } else {
    }
    //cargarusuario();
    $(".solonumeros").keydown(function (event) {

        // Desactivamos cualquier combinación con shift
        if (event.shiftKey)
            event.preventDefault();

        /*  
            No permite ingresar pulsaciones a menos que sean los siguientes
            KeyCode Permitidos
            keycode 8 Retroceso
            keycode 37 Flecha Derecha
            keycode 39  Flecha Izquierda
            keycode 46 Suprimir
        */
        //No permite mas de 11 caracteres Numéricos
        if (event.keyCode != 46 && event.keyCode != 8 && event.keyCode != 37 && event.keyCode != 39)
            if ($(this).val().length >= 11)
                event.preventDefault();

        // Solo Numeros del 0 a 9 
        if (event.keyCode < 48 || event.keyCode > 57)
            //Solo Teclado Numerico 0 a 9
            if (event.keyCode < 96 || event.keyCode > 105)
                /*  
                    No permite ingresar pulsaciones a menos que sean los siguietes
                    KeyCode Permitidos
                    keycode 8 Retroceso
                    keycode 37 Flecha Derecha
                    keycode 39  Flecha Izquierda
                    keycode 46 Suprimir
                */
                if (event.keyCode != 46 && event.keyCode != 8 && event.keyCode != 37 && event.keyCode != 39)
                    event.preventDefault();
    });

    $(".sololetras").keypress(function (key) {
        window.console.log(key.charCode)
        if ((key.charCode < 97 || key.charCode > 122)//letras mayusculas
            && (key.charCode < 65 || key.charCode > 90) //letras minusculas
            && (key.charCode != 45) //retroceso
            && (key.charCode != 241) //ñ
            && (key.charCode != 209) //Ñ
            && (key.charCode != 32) //espacio
            && (key.charCode != 225) //á
            && (key.charCode != 233) //é
            && (key.charCode != 237) //í
            && (key.charCode != 243) //ó
            && (key.charCode != 250) //ú
            && (key.charCode != 193) //Á
            && (key.charCode != 201) //É
            && (key.charCode != 205) //Í
            && (key.charCode != 211) //Ó
            && (key.charCode != 218) //Ú

        )
            return false;
    });
});


// ***** Horizontal Hover Menu ***** //

// $('body').addClass('horizontal-hover');

$(document).ready(function () {
    function light() {
        if (document.querySelector('body').classList.contains('light-mode')) {
            $('#myonoffswitch3').prop('checked', true);
            $('#myonoffswitch6').prop('checked', true);
        }
    }
    light();
    let bodyhorizontal = $('body').hasClass('horizontal-hover');
    if (bodyhorizontal) {
        let li = document.querySelectorAll('.side-menu li')
        li.forEach((e, i) => {
            e.classList.remove('is-expanded')
        })
        var animationSpeed = 300;
        // first level
        var parent = $("[data-bs-toggle='sub-slide']").parents('ul');
        var ul = parent.find('ul:visible').slideUp(animationSpeed);
        ul.removeClass('open');
        var parent1 = $("[data-bs-toggle='sub-slide2']").parents('ul');
        var ul1 = parent1.find('ul:visible').slideUp(animationSpeed);
        ul1.removeClass('open');
        $('body').addClass('horizontal-hover');
        $('body').addClass('horizontal');
        $(".main-content").addClass("hor-content");
        $(".main-content").removeClass("app-content");
        $(".main-container").addClass("container");
        $(".main-container").removeClass("container-fluid");
        $(".app-header").addClass("hor-header");
        $(".app-header").removeClass("app-header");
        $(".app-sidebar").addClass("horizontal-main")
        $(".main-sidemenu").addClass("container")
        $('body').removeClass('sidebar-mini');
        $('body').removeClass('sidenav-toggled');
        $('body').removeClass('default-menu');
        $('body').removeClass('icontext-menu');
        $('body').removeClass('icon-overlay');
        $('body').removeClass('closed-leftmenu');
        $('body').removeClass('hover-submenu');
        $('body').removeClass('hover-submenu1');
        // $('#slide-left').addClass('d-none');
        // $('#slide-right').addClass('d-none');
        $('#slide-left').removeClass('d-none');
        $('#slide-right').removeClass('d-none');
        if (document.querySelector('.horizontal-hover').firstElementChild.classList.contains('login-img') !== true) {
            document.querySelector('.horizontal-hover .side-menu').style.flexWrap = 'nowrap'
            HorizontalHovermenu();
            checkHoriMenu();
            responsive();
        }
    } else {
    }
    EjecutarDetalleInformacionGeneral();
    //EjecutarDetalleCiudadano();
});

/******* Transparent Bg-Image Style *******/

// Bg-Image1 Style
// $('body').addClass('bg-img1');
// $('body').addClass('transparent-mode');

// Bg-Image2 Style
// $('body').addClass('bg-img2');
// $('body').addClass('transparent-mode');

// Bg-Image3 Style
// $('body').addClass('bg-img3');
// $('body').addClass('transparent-mode');

// Bg-Image4 Style
// $('body').addClass('bg-img4');
// $('body').addClass('transparent-mode');


function resetData() {
    $('#myonoffswitch3').prop('checked', true);
    $('#myonoffswitch6').prop('checked', true);
    $('#myonoffswitch1').prop('checked', true);
    $('#myonoffswitch9').prop('checked', true);
    $('#myonoffswitch10').prop('checked', false);
    $('#myonoffswitch11').prop('checked', true);
    $('#myonoffswitch12').prop('checked', false);
    $('#myonoffswitch13').prop('checked', true);
    $('#myonoffswitch14').prop('checked', false);
    $('#myonoffswitch15').prop('checked', false);
    $('#myonoffswitch16').prop('checked', false);
    $('#myonoffswitch17').prop('checked', false);
    $('#myonoffswitch18').prop('checked', false);
    $('body')?.removeClass('bg-img4');
    $('body')?.removeClass('bg-img1');
    $('body')?.removeClass('bg-img2');
    $('body')?.removeClass('bg-img3');
    $('body')?.removeClass('transparent-mode');
    $('body')?.removeClass('dark-mode');
    $('body')?.removeClass('dark-menu');
    $('body')?.removeClass('color-menu');
    $('body')?.removeClass('gradient-menu');
    $('body')?.removeClass('dark-header');
    $('body')?.removeClass('color-header');
    $('body')?.removeClass('gradient-header');
    $('body')?.removeClass('layout-boxed');
    $('body')?.removeClass('icontext-menu');
    $('body')?.removeClass('icon-overlay');
    $('body')?.removeClass('closed-leftmenu');
    $('body')?.removeClass('hover-submenu');
    $('body')?.removeClass('hover-submenu1');
    $('body')?.removeClass('sidenav-toggled');
    $('body')?.removeClass('scrollable-layout');
}

/// rutas de servicio Ubigeo

let globals = {
    urlWebApi: "https://localhost:44370/",
    urlMvc: "https://localhost:44300/",
    urlUbigeoDepartamento: "https://qa.agrorural.gob.pe/ubigeoAPI/api/Departamento/ListarDepartamento",
    urlUbigeoProvincia: "https://qa.agrorural.gob.pe/ubigeoAPI/api/Provincia/ListarProvinciaPorDepartamento",
    urlUbigeoDistrito: "https://qa.agrorural.gob.pe/ubigeoAPI/api/Distrito/ListarDistritoPorProvincia",
    urlregistroCiudadano: "https://qa.agrorural.gob.pe/SLSEARAPI/api/Extensionista/InsertarExtensionista",
    urlListarProcedencia: "https://qa.agrorural.gob.pe/SLSEARAPI/api/Procedencia/ListarProcedencia",
    urlListarRegimen: "https://qa.agrorural.gob.pe/SLSEARAPI/api/Regimen/ListarRegimen",
    urlListarTipoEntidad: "https://qa.agrorural.gob.pe/SLSEARAPI/api/TipoEntidad/ListarTipoEntidad",
    urlListarDireccionGerencia: "https://qa.agrorural.gob.pe/SLSEARAPI/api/DireccionGerenciaRegionalAgraria/ListarDireccionGerenciaRegionalAgraria",
    //urlListarAgenciaAgraria: "https://qa.agrorural.gob.pe/SLSEARAPI/api/AgenciaAgraria/ListarAgenciaAgraria",
    urlListarAgenciaAgraria: "http://localhost:49635/api/AgenciaAgraria/ListarAgenciaAgraria",  
    urlRegistrarExtensionista: "https://qa.agrorural.gob.pe/SLSEARAPI/api/Extensionista/InsertarExtensionista",
    //urlRegistrarExtensionista: "http://localhost:49635/api/Extensionista/InsertarExtensionista",
    urlListarNivel: "https://qa.agrorural.gob.pe/SLSEARAPI/api/Nivel/ListarNivel",
    //urlLogin: globals.urlMvc +"api/Extensionista/Login",
    urlRegistrorequisitos: "http://localhost:44370/",
    urlListarRequisitos:"http://localhost:49635/api/ListaChequeoRequisitos/ListarChequeoRequisitos",
    urldescargarrequisito: "http://localhost:49635/api/ListaChequeoRequisitos/GenerarPdfRequisitos",
    urldescargaalianzaestrategica: "http://localhost:49635/api/ListaChequeoRequisitos/GenerarPdfAlianzaEstrategica",
    urldescargaactacompromiso: "http://localhost:49635/api/ListaChequeoRequisitos/GenerarPdfActaCompromiso",    
    urldescargaacta: "http://localhost:49635/api/ListaChequeoRequisitos/GenerarPdfActa",
    urlInsertarArchivo: "http://localhost:49635/api/Archivo/InsertarArchivo",
    urlListarTipoProveedor: "http://localhost:49635/api/FichaTecnica/ListarTipoProveedor",
    urlRegistrarFichaTecnica: "http://localhost:49635/api/FichaTecnica/InsertarFichaTecnica",
    //urlActualizarrequisitos: globals.urlMvc+"api/ListaChequeoRequisitos/ActualizarDardeBajaListaChequeoRequisitos",
    //urlListarArchivo: globals.urlMvc+"api/Archivo/ListarArchivo",
    //urlDescargaArchivo: globals.urlMvc +"api/Archivo/DescargarArchivoFile",
    //urlEliminarArchivo: globals.urlMvc +"api/Archivo/EliminarArchivo",
    //urlInsertarProductor: globals.urlMvc +"api/ActaAlianzaEstrategica/InsertarProductor",
    //urlListarProductor: globals.urlMvc+"api/ActaAlianzaEstrategica/ListarProductor",
    usuario:0,
    lenguajeDataTable: {
        processing: "Cargando registros..."
        , lengthMenu: "Mostrar _MENU_ registros"
        , zeroRecords: "No se han encontrado registros"
        , emptyTable: "No se han encontrado registros"
        , info: "Mostrando _START_ al _END_ de _MAX_ registros"
        , infoEmpty: "Mostrando 0 al 0 de 0 registros"
        , infoFiltered: "(filtrado de _MAX_ registros)"
        , infoPostFix: ""
        , search: "Buscar:"
        , url: ""
        , thousands: ","
        , loadingRecords: "Cargando..."
        , paginate: {
            first: "Primero"
            , last: "Último"
            , next: "Siguiente"
            , previous: "Anterior"
        }
        , aria: {
            sortAscending: ": Activar para ordenar la columna de manera ascendente"
            , sortDescending: ": Activar para ordenar la columna de manera descendente"
        }
    },
    sidenavs: null,
    collapsibles: [],
    modals: [],
    selects: [],
    dropdowns: [],
    scrollspy: []
}

function loadshow() {
    $("#global-loader").show();
}

function loadhide() {
    $("#global-loader").hide();
}

function salir() {
    salirsession();
}


function salirsession() {
    
    window.location.href = globals.urlMvc; 

    $.ajax({
        url: $('#hdrutasessioncerrar').val(),
        type: 'get',
        dataType: 'json',
        //        data: objusuario,
        cache: false,
        success: function (data) {
            console.log(data);
            debugger;
            //if (data.Success) {
            //debugger;
            setTimeout(function () {
                alert('Reloading Page');
                location.reload(true);
                location.reload();
                window.location.replace($('#hdruta').val());
                window.history.forward(-1);
            }, 2000);          
        },
        error: function () {
        }
    });
}

//function salirsession() {    
//    //debugger;
//    //window.location.href = $('#hdrutasessioncerrar').val();  
//    //window.location.replace($('#hdrutasessioncerrar').val());
//    //debugger;
//    //var backlen = history.length;
//    //history.go(-backlen);
//    //document.location.replace($('#hdrutasessioncerrar').val());
//    //window.location.href = $('#hdrutasessioncerrar').val();
//    //document.location

//    $.ajax({
//        url: $('#hdrutasessioncerrar').val(),
//        type: 'post',
//        dataType: 'json',
////        data: objusuario,
//        cache: false,
//        success: function (data) {
//            console.log(data);
//            //debugger;
//            if (data.Success) {
//                //debugger;

//                setTimeout(function () {
//                    alert('Reloading Page');
//                    location.reload(true);
//                    location.reload();
//                    window.location.replace($('#hdruta').val());
//                }, 2000);

//                //window.location.replace($('#hdruta').val());
//                //window.location.reload();
//                //console.log('inciado session');
//                //notif({
//                //    msg: "<b>Correcto:</b> Ingreso Correctamente",
//                //    type: "success"
//                //});
//                ////console.log($('#hdruta').val());

//                //var url = $('#hdruta').val();

//                //window.location.href = url;
//                // window.location.href = $("#vRutaHome").val();
//            } else {
//                //error_login();
//            }
//        },
//        error: function () {
//        }
//    });
//}

function abrirformulacion() {
    console.log('abrir formulacion');
    window.location.href = $('#hdnpaginaformulacion').val();     
}

function cargarusuario() {

    let usuario = $('#hdnusuario').val();

    let arreglousuario = new Array();
    arreglousuario = usuario.split('|');    
    document.getElementById('lblusuariologeado').innerHTML = arreglousuario[1] + " " + arreglousuario[2] + " " + arreglousuario[3];
    document.getElementById('lblultimoacceso').innerHTML = arreglousuario[4];

    if (arreglousuario[5] == 0) {
        $('#subitemmenu7').attr('style', 'visibility:hidden');  
        $('#subitemmenu8').attr('style', 'visibility:hidden');        
    }
}