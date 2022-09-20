using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SLSEAR.Controllers
{
    public class IndicacionesController : Controller
    {
        // GET: Indicaciones
        public ActionResult Index()
        {
            if (Session["iCodUsuario"] != null)
            {
                ViewBag.usuario = Session["iCodUsuario"];

                return View();
            }
            else
            {
                return RedirectToAction("Login", "Ciudadano");
            }
        }
        //[HttpPost]
        [Route("Ciudadano/Login")]
        public ActionResult Salir()
        {
            Session["iCodUsuario"] = null;

            //return Json(new { Success = true });
            //return View("Login", "Ciudadano");
            return Redirect("/Ciudadano/Login");
        }
    }
}