(function () {

    angular.module(ymcGlobals.appName)
        .factory('actionItemService', actionItemService);

    actionItemService.$inject = ['$http', '$q'];

    function actionItemService($http, $q) {
        return {
            loadActionItems: _loadActionItems
            , postActionItem: _postActionItem
            , deleteActionItem: _deleteActionItem
            , loadAllActionItemTypes: _loadAllActionItemTypes
            , updateActionItem: _updateActionItem
            , loadActionItemById: _loadActionItemById
            , loadActionItemStatus: _loadActionItemStatus
            , loadActionItemsByPerson: _loadActionItemsByPerson
            , searchActionItems: _searchActionItems
        };
        
        function _searchActionItems(actionItemStatus, actionItemTypeId, assignedDateBegin, assignedDateEnd, dueDateBegin, dueDateEnd, assignees, searchString) {
            searchString = searchString || '';
         
            var url = '/api/actionitemfilter' + '/?searchString=' + searchString; 
            
            if (actionItemTypeId) {
                url += '&actionItemTypeId=' + actionItemTypeId;
            }
            if (assignedDateBegin) {
                url += '&assignedDateBegin=' + assignedDateBegin;
            }
            if (assignedDateEnd) {
                url += '&assignedDateEnd=' + assignedDateEnd;
            }
            if (dueDateBegin) {
                url += '&dueDateBegin=' + dueDateBegin;
            }
            if (dueDateEnd) {
                url += '&dueDateEnd=' + dueDateEnd;
            }
            if (assignees) {
                var count = assignees.length;
                for (var i = 0; i < count; i++) {
                    url += '&assignees=' + assignees[i];
                }
                
            }
            if (actionItemStatus) {
                url += '&actionItemStatus=' + actionItemStatus;
            }
            var settings = {
                url: url,
                method: 'GET',
                cache: false,
                responseType: 'json',
                withCredentials: true
            };
            return $http(settings).then(_getAllComplete, _getAllFailed);
        }

        function _getAllComplete(response) {
            console.log("got a search response");
            return response.data;

        }

        function _getAllFailed(error) {
            var msg = 'Failed to retrieve Action Items';
            if (error.data && error.data.description) {
                msg += '\n' + error.data.description;
            }
            error.data.description = msg;
            return $q.reject(error);
        }


        function _loadActionItemsByPerson(id) {
            var settings = {
                 url: "/api/actionitembyperson/" + id
                , method: "GET"
                , cache: false
                , contentType: 'application/json; charset=UTF-8'
                , withCredentials: true
            }
            return $http(settings).then(_loadAllActionItemsSuccess, _loadAllActionItemsFailure);
        }

        function _loadActionItemStatus() {
            var settings = {
                url: "/api/actionitemstatus"
                , method: "GET"
                , cache: false
                , contentType: 'application/json; charset=UTF-8'
                , withCredentials: true
            }
            return $http(settings).then(_loadActionItemStatusSuccess, _loadActionItemStatusFailure);
        }
        function _loadActionItemStatusSuccess(response) {
            return response;
        }
        function _loadActionItemStatusFailure(error) {
            return $q.reject(error);
        }
        //---------------------------------ACTION ITEM GET BY ID--------------------------------------------------
        function _loadActionItemById(data) {
            var settings = {
                url: "/api/actionitem/" + data
                , method: "GET"
                , cache: false
                , contentType: 'application/json; charset=UTF-8'
                , withCredentials: true
            }
            return $http(settings).then(_loadActionItemSuccess, _loadActionItemFailure);
        }
        function _loadActionItemSuccess(response) {
            return response.data;
        }

        function _loadActionItemFailure(error) {
            return $q.reject(error);
        }

        //---------------------------------ACTION ITEM UPDATE-------------------------------------------------
        function _updateActionItem(data) {
            var settings = {
                url: "/api/actionitem/" + data.id
                , method: "PUT"
                , cache: false
                , contentType: 'application/json; charset=UTF-8'
                , data: JSON.stringify(data)
                , withCredentials: true
            }
            return $http(settings).then(_putActionItemSuccess, _putActionItemFailure);
        }
        function _putActionItemSuccess(response) {
            return response;
        }
        function _putActionItemFailure(error) {
            return $q.reject(error);
        }
        //---------------------------------------ACTION ITEM TYPE GET ALL-------------------------------------
        function _loadAllActionItemTypes() {
            var settings = {
                url: "/api/actionitemtype"
                , method: "GET"
                , cache: false
                , contentType: 'application/json; charset=UTF-8'
                , withCredentials: true
            }
            return $http(settings).then(_loadAllActionItemsSuccess, _loadAllActionItemsFailure);
        }

        function _loadAllActionItemsSuccess(response) {
            return response.data.items;
        }

        function _loadAllActionItemsFailure(error) {
            return $q.reject(error);
        }

        //-------------------------------------DELETE ACTION ITEM--------------------------------------------

        function _deleteActionItem(id) {
            var settings = {
                url: "/api/actionitem/" + id
                , method: "DELETE"
                , cache: false
                , contentType: 'application/json; charset=UTF-8'
                , withCredentials: true
            }
            return $http(settings).then(_deleteActionItemSuccess, _deleteActionItemFailure);
        }

        function _deleteActionItemSuccess(response) {
            return response;
        }

        function _deleteActionItemFailure(error) {
            return $q.reject(error);
        }

        //-------------------------------------POST ACTION ITEM------------------------------------------------
        function _postActionItem(data) {
            var settings = {
                url: "/api/actionitem/"
                , method: "POST"
                , cache: false
                , contentType: 'application/json; charset=UTF-8'
                , data: JSON.stringify(data)
                , withCredentials: true
            };
            return $http(settings)
                .then(_postActionItemSuccess, _postActionItemError);
        }

        function _postActionItemSuccess(response) {

            return response.data.items;

        }

        function _postActionItemError(error) {
            return $q.reject(error);
        }

        //-------------------------------------GET ALL ACTION ITEMS------------------------------
        function _loadActionItems() {
            var settings = {
                url: "/api/actionitem/"
                , method: "GET"
                , cache: false
                , contentType: 'application/json; charset=UTF-8'
                , withCredentials: true
            }
            return $http(settings).then(_actionItemSuccess, _actionItemError);
        }
        function _actionItemSuccess(response) {

            return response.data.items;

        }
        function _actionItemError(error) {
            console.log(error);
            return $q.reject(error);
        }
    }
})();