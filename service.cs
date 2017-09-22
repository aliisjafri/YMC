using Sabio.Data;
using Sabio.Data.Extensions;
using Sabio.Data.Providers;
using Sabio.Models.Domain;
using Sabio.Models.Requests;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace Sabio.Services
{
    public class ActionItemService
    {
        private IDataProvider _prov;

        public ActionItemService(IDataProvider provider)
        {
            _prov = provider;
        }

        public List<ActionItem> GetAll()
        {
            List<ActionItem> list = null;
            Dictionary<int, ActionItem> dct = null;
            _prov.ExecuteCmd("dbo.ActionItem_SelectAll",
                inputParamMapper: null,
                singleRecordMapper: delegate (IDataReader rdr, short set)
                {
                    switch (set)
                    {
                        case 0:
                            ActionItem e = MapActionItem(rdr);
                            if (dct == null)
                            {
                                dct = new Dictionary<int, ActionItem>();
                            }

                            dct.Add(e.Id, e);

                            if (list == null)
                            {
                                list = new List<ActionItem>();
                            }
                            list.Add(e);
                            break;

                        case 1:
                            int actionItemId = rdr.GetSafeInt32(0);
                            PersonBase per = MapPersonBase(rdr, 1);

                            ActionItem parent = dct[actionItemId];
                            if (parent.Assignees == null)
                            {
                                parent.Assignees = new List<PersonBase>();
                            }

                            parent.Assignees.Add(per);

                            break;
                    }
                });
            return list;

        }

        public List<Status> GetAllStatuses()
        {
            List<Status> who = null;

            _prov.ExecuteCmd("dbo.ActionItemStatus_SelectAll",
                inputParamMapper: null,
                singleRecordMapper: delegate (IDataReader rdr, short set)
                {
                    switch (set)
                    {
                        case 0:
                            Status e = new Status();
                            int ord = 0;
                            e.Id = rdr.GetSafeInt32(ord++);
                            e.Name = rdr.GetSafeString(ord++);
                            if (who == null)
                            {
                                who = new List<Status>();
                            }
                            who.Add(e);
                            break;
                    }
                }
                );
            return who;
        }

        public ActionItem GetById(int Id)
        {
            ActionItem who = null;

            _prov.ExecuteCmd("dbo.ActionItem_SelectById",
                inputParamMapper: delegate (SqlParameterCollection parameter)
                {
                    parameter.AddWithValue("@Id", Id);
                },
                singleRecordMapper: delegate (IDataReader rdr, short set)
                {
                    switch (set)
                    {
                        case 0:
                            who = MapActionItem(rdr);
                            break;

                        case 1:
                            int actionItemId = rdr.GetSafeInt32(0);
                            PersonBase per = MapPersonBase(rdr, 1);
                            ActionItem parent = who;
                            if (parent.Assignees == null)
                            {
                                parent.Assignees = new List<PersonBase>();
                            }
                            parent.Assignees.Add(per);
                            break;
                    }
                }
                );
            return who;
        }

        public List<ActionItem> GetByPersonId(int Id)
        {
            List<ActionItem> who = null;

            _prov.ExecuteCmd("dbo.ActionItem_SearchByPersonId",
                inputParamMapper: delegate (SqlParameterCollection parameter)
                {
                    parameter.AddWithValue("@PersonId", Id);
                },
                singleRecordMapper: delegate (IDataReader rdr, short set)
                {
                    switch (set)
                    {
                        case 0:
                            ActionItem e = new ActionItem();
                            int ord = 0;
                            e.Id = rdr.GetSafeInt32(ord++);
                            e.UserId = rdr.GetSafeInt32(ord++);
                            e.AssignedDate = rdr.GetSafeUtcDateTime(ord++);
                            e.DueDate = rdr.GetSafeUtcDateTime(ord++);
                            e.Description = rdr.GetSafeString(ord++);
                            ActionItemType ait = new ActionItemType();
                            e.ActionItemType = ait;
                            e.ActionItemType.Id = rdr.GetSafeInt32(ord++);
                            e.Name = rdr.GetSafeString(ord++);
                            Status ais = new Status();
                            e.ActionItemStatus = ais;
                            e.ActionItemStatus.Id = rdr.GetSafeInt32(ord++);
                            e.ActionItemType.Name = rdr.GetSafeString(ord++);
                            e.ActionItemStatus.Name = rdr.GetSafeString(ord++);
                            e.IsOverDue = rdr.GetSafeInt32(ord++);
                            if (who == null)
                            {
                                who = new List<ActionItem>();
                            }
                            who.Add(e);
                            break;
                    }
                }
                );
            return who;
        }

        public int Post(ActionItemAddRequest model)
        {
            int id = 0;

            _prov.ExecuteNonQuery("dbo.ActionItem_Insert",
                inputParamMapper: delegate (SqlParameterCollection paramCollection)
                {
                    paramCollection.AddWithValue("@UserId", model.UserId);
                    paramCollection.AddWithValue("@AssignedDate", model.AssignedDate);
                    paramCollection.AddWithValue("@DueDate", model.DueDate);
                    paramCollection.AddWithValue("@Description", model.Description);
                    paramCollection.AddWithValue("@ActionItemTypeId", model.ActionItemTypeId);
                    paramCollection.AddWithValue("@Name", model.Name);
                    paramCollection.AddWithValue("@Status", model.Status);
                    paramCollection.AddWithValue("@AssigneeIds", model.AssigneeIds.ToDataTable());

                    SqlParameter idParameter = new SqlParameter("@Id", System.Data.SqlDbType.Int);
                    idParameter.Direction = System.Data.ParameterDirection.Output;

                    paramCollection.Add(idParameter);
                },
                returnParameters: delegate (SqlParameterCollection param)
                {
                    id = (int)param["@Id"].Value;
                }
                );
            return id;
        }

        public int Put(ActionItemUpdateRequest model)
        {
            int id = 0;

            _prov.ExecuteNonQuery("dbo.ActionItem_Update",
                inputParamMapper: delegate (SqlParameterCollection paramCollection)
                {
                    paramCollection.AddWithValue("@Id", model.Id);
                    paramCollection.AddWithValue("@AssignedDate", model.AssignedDate);
                    paramCollection.AddWithValue("@DueDate", model.DueDate);
                    paramCollection.AddWithValue("@Description", model.Description);
                    paramCollection.AddWithValue("@ActionItemTypeId", model.ActionItemTypeId);
                    paramCollection.AddWithValue("@Name", model.Name);
                    paramCollection.AddWithValue("@Status", model.Status);
                    paramCollection.AddWithValue("@AssigneeIds", model.AssigneeIds.ToDataTable());
                }, 
                returnParameters: delegate (SqlParameterCollection param)
                {
                    id = (int)param["@Id"].Value;
                }
                );
            return id;
        }

        public int Delete(int Id)
        {
            int delete = 0;

            _prov.ExecuteNonQuery("dbo.ActionItem_Delete"
                , inputParamMapper: delegate (SqlParameterCollection paramCollection)
                {
                    paramCollection.AddWithValue("@Id", Id);
                },
                returnParameters: delegate (SqlParameterCollection param)
                {
                    delete = (int)param["@Id"].Value;
                }
                );
            return delete;
        }

        public List<ActionItem> SearchItems(ActionItemSearchRequest model)
        {
            List<ActionItem> list = null;

            _prov.ExecuteCmd("dbo.ActionItem_Search",
                inputParamMapper: delegate (SqlParameterCollection paramCollection)
                {
                    paramCollection.AddWithValue("@ActionItemStatus", model.ActionItemStatus);
                    paramCollection.AddWithValue("@ActionItemTypeId", model.ActionItemTypeId);
                    paramCollection.AddWithValue("@AssignedDateBegin", model.AssignedDateBegin);
                    paramCollection.AddWithValue("@AssignedDateEnd", model.AssignedDateEnd);
                    paramCollection.AddWithValue("@DueDateBegin", model.DueDateBegin);
                    paramCollection.AddWithValue("@DueDateEnd", model.DueDateEnd);
                    paramCollection.AddWithValue("@Assignees", model.Assignees.ToDataTable());
                    paramCollection.AddWithValue("@SearchString", model.SearchString);
                }, 
                singleRecordMapper: delegate (IDataReader rdr, short set)
                {
                    ActionItem item = MapActionItem(rdr);
                    if (list == null)
                    {
                        list = new List<ActionItem>();
                    }
                    list.Add(item);
                });
            return list;
        }

        private static PersonBase MapPersonBase(IDataReader rdr, int ord = 0)
        {

            PersonBase per = new PersonBase();
            per.Id = rdr.GetSafeInt32(ord++);
            per.FirstName = rdr.GetSafeString(ord++);
            per.LastName = rdr.GetSafeString(ord++);
            per.Email = rdr.GetSafeString(ord++);
            per.Photo = rdr.GetSafeString(ord++);
            return per;
        }

        private static ActionItem MapActionItem(IDataReader rdr)
        {
            ActionItem e = new ActionItem();
            int ord = 0;
            e.Id = rdr.GetSafeInt32(ord++);
            e.UserId = rdr.GetSafeInt32(ord++);
            e.AssignedDate = rdr.GetSafeUtcDateTime(ord++);
            e.DueDate = rdr.GetSafeUtcDateTime(ord++);
            e.Description = rdr.GetSafeString(ord++);
            ActionItemType ait = new ActionItemType();
            e.ActionItemType = ait;
            e.ActionItemType.Id = rdr.GetSafeInt32(ord++);
            e.Name = rdr.GetSafeString(ord++);
            Status ais = new Status();
            e.ActionItemStatus = ais;
            e.ActionItemStatus.Id = rdr.GetSafeInt32(ord++);
            e.ActionItemType.Name = rdr.GetSafeString(ord++);
            e.ActionItemStatus.Name = rdr.GetSafeString(ord++);
            e.IsOverDue = rdr.GetSafeInt32(ord++);
            return e;
        }

    }
}
