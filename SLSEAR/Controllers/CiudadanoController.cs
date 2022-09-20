using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SLSEAR.Controllers
{
    public class CiudadanoController : Controller
    {
        // GET: Ciudadano
        public ActionResult Index()
        {
            if (Session["iCodUsuario"] != null)
            {
                ViewBag.usuario = Session["iCodUsuario"];
                Response.Cache.SetCacheability(HttpCacheability.NoCache);
                Response.Cache.SetExpires(DateTime.UtcNow.AddHours(-1));
                Response.Cache.SetNoStore();
                return View();
            }
            else
            {
                return RedirectToAction("Login", "Ciudadano");
            }
        }

        public ActionResult Registro()
        {
            return View();
        }
        [HttpPost]
        public JsonResult Ingresar(FormCollection collection)
        {
            Session["iCodUsuario"] = collection.Get("iCodUsuario");               
            return Json(new { Success = true });
        }

        [Route("Ciudadano/Login")]
        public ActionResult Salir()
        {
            Session["iCodUsuario"] = null;

            //return Json(new { Success = true });
            //return View("Login", "Ciudadano");
            return Redirect("/Ciudadano/Login");
        }
        public ActionResult Login()
        {
            ViewBag.usuario = Session["iCodUsuario"];
            return View();
        }

        //// GET: Ciudadano/Details/5
        //public ActionResult Details(int id)
        //{
        //    return View();
        //}

        //// GET: Ciudadano/Create
        //public ActionResult Create()
        //{
        //    return View();
        //}

        //// POST: Ciudadano/Create
        //[HttpPost]
        //public ActionResult Create(FormCollection collection)
        //{
        //    try
        //    {
        //        // TODO: Add insert logic here

        //        return RedirectToAction("Index");
        //    }
        //    catch
        //    {
        //        return View();
        //    }
        //}

        //// GET: Ciudadano/Edit/5
        //public ActionResult Edit(int id)
        //{
        //    return View();
        //}

        //// POST: Ciudadano/Edit/5
        //[HttpPost]
        //public ActionResult Edit(int id, FormCollection collection)
        //{
        //    try
        //    {
        //        // TODO: Add update logic here

        //        return RedirectToAction("Index");
        //    }
        //    catch
        //    {
        //        return View();
        //    }
        //}

        //// GET: Ciudadano/Delete/5
        //public ActionResult Delete(int id)
        //{
        //    return View();
        //}

        //// POST: Ciudadano/Delete/5
        //[HttpPost]
        //public ActionResult Delete(int id, FormCollection collection)
        //{
        //    try
        //    {
        //        // TODO: Add delete logic here

        //        return RedirectToAction("Index");
        //    }
        //    catch
        //    {
        //        return View();
        //    }
        //}
    }
}
