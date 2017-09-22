using Sabio.Models.Domain;
using Sabio.Models.Requests;
using Sabio.Models.Responses;
using Sabio.Services;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Sabio.Web.Controllers.Api
{
    [RoutePrefix("api/actionitem")]
    public class ActionItemApiController : ApiController
    {
        ActionItemService _svc;

        public ActionItemApiController(ActionItemService service )
        {
            _svc = service;
        }
        
        [HttpGet]
        [Route]
        public HttpResponseMessage GetAll()
        {
            ItemsResponse<ActionItem> response = new ItemsResponse<ActionItem>();
            response.Items = _svc.GetAll();
            return Request.CreateResponse(HttpStatusCode.OK, response);
        }

        [HttpGet]
        [Route("~/api/actionitemstatus")]
        public HttpResponseMessage GetAllStatuses()
        {
            ItemsResponse<Status> response = new ItemsResponse<Status>();
            response.Items = _svc.GetAllStatuses();
            return Request.CreateResponse(HttpStatusCode.OK, response);
        }

        [HttpGet]
        [Route("{id}")]
        public HttpResponseMessage GetById(int Id)
        {
            ItemResponse<ActionItem> response = new ItemResponse<ActionItem>();
            response.Item = _svc.GetById(Id);
            return Request.CreateResponse(HttpStatusCode.OK, response);
        }

        [Route("~/api/actionitembyperson/{id}")]
        public HttpResponseMessage GetByPersonId(int Id)
        {
            ItemsResponse<ActionItem> response = new ItemsResponse<ActionItem>();
            response.Items = _svc.GetByPersonId(Id);
            return Request.CreateResponse(HttpStatusCode.OK, response);
        }
        
        [HttpGet]
        [Route("~/api/actionitemfilter")]
        public HttpResponseMessage SearchItems([FromUri]ActionItemSearchRequest model)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
            ItemsResponse<ActionItem> response = new ItemsResponse<ActionItem>();
            response.Items = _svc.SearchItems(model);
            return Request.CreateResponse(HttpStatusCode.OK, response);
        }

        [HttpPost]
        [Route]
        public HttpResponseMessage Post(ActionItemAddRequest model)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
            ItemResponse<int> response = new ItemResponse<int>(); 
            response.Item = _svc.Post(model);
            return Request.CreateResponse(HttpStatusCode.OK, response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public HttpResponseMessage Put(ActionItemUpdateRequest model)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
            ItemResponse<int> response = new ItemResponse<int>(); 
            response.Item = _svc.Put(model);
            return Request.CreateResponse(HttpStatusCode.OK, response);
        }

        [HttpDelete]
        [Route("{id}")]
        public HttpResponseMessage Delete(int Id)
        {
            ItemResponse<int> response = new ItemResponse<int>();
            response.Item = _svc.Delete(Id);
            return Request.CreateResponse(HttpStatusCode.OK, new SuccessResponse());
        }
    }
}