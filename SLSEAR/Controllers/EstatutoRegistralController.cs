using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SLSEAR.Controllers
{
    public class EstatutoRegistralController : Controller
    {
        // GET: EstatutoRegistral
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
    }
}