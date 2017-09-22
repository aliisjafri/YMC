// -----------------------------------------------MAIN CONTROLLER-----------------------------------------------
(function () {

    angular.module(ymcGlobals.appName).controller('IndexCtrl', IndexCtrl);

    IndexCtrl.$inject = ['actionItemService', 'personBaseService', '$scope', 'userService', '$rootScope', '$stateParams'];

    function IndexCtrl(actionItemService, personBaseService, $scope, userService, $rootScope, $stateParams, $element) {
        var vm = this;
        vm.$scope = $scope;
        vm.actionItemService = actionItemService;
        vm.personBaseService = personBaseService;
        vm.userService = userService;
        vm.swal = swal;

        vm.form = false;
        vm.modality = false;
        vm.postActionItem = _postActionItem;
        vm.deleteActionItem = _deleteActionItem;
        vm.updateActionItem = _updateActionItem;
        vm.updateActionItemFromLayout = _updateActionItemFromLayout;
        vm.loadAllActionItemTypes = _loadAllActionItemTypes;
        vm.loadAllPersonIds = _loadAllPersonIds;
        vm.loadActionItemStatus = _loadActionItemStatus;
        vm.searchActionItems = _searchActionItems;
        vm.clearFilterForm = _clearFilterForm;

        vm.itemType = []; //Holds all action Item Types
        vm.personIds = []; //holds All PersonIds
        vm.items = []; //Holds All action Items on page load here
        vm.status = [];//Holds All Action Item Statuses here
        vm.currentUser = []; //Holds CurrentUser Info in here
        vm.filter = [];

        //DateTime Validation Functions
        vm.startDateBeforeRender = _startDateBeforeRender; //Omits the option to select a date before todays date
        vm.startDateOnSetTime = _startDateOnSetTime;
        vm.endDateBeforeRender = _endDateBeforeRender;
        vm.endDateOnSetTime = _endDateOnSetTime;

        //DateTime Filter Validation ASSIGNED DATE Functions for aDate
        vm.aDateStartDateBeforeRender = _aDateStartDateBeforeRender;
        vm.aDateStartDateOnSetTime = _aDateStartDateOnSetTime;
        vm.aDateEndDateBeforeRender = _aDateEndDateBeforeRender;
        vm.aDateEndDateOnSetTime = _aDateEndDateOnSetTime;

        //DateTime Filter Validation DUE DATE Functions for dDate
        vm.dDateStartDateBeforeRender = _dDateStartDateBeforeRender;
        vm.dDateStartDateOnSetTime = _dDateStartDateOnSetTime;
        vm.dDateEndDateBeforeRender = _dDateEndDateBeforeRender;
        vm.dDateEndDateOnSetTime = _dDateEndDateOnSetTime;

        //Handlers
        vm.addBtn = _addBtn;
        vm.editList = _editList;
        vm.item = null;
        vm.$onInit = _onInit;
        vm.cancelActionItem = _cancelActionItem;

        $scope.$watch(function () {
            $element.find('.dropDownRefresh').selectpicker('refresh');
        })

        //--------------------ACTION ITEM SEARCH--------------------
        function _searchActionItems() {
            if (vm.filter.actionItemType != null) {
                vm.filter.actionItemTypeId = vm.filter.actionItemType.id;
            }
            if (vm.filter.actionItemStatus != null) {
                vm.filter.actionItemStatusId = vm.filter.actionItemStatus.id;
            }
            if (vm.filter.assignedDateBegin != null) {
                vm.filter.assignedDateBegin = moment(vm.filter.assignedDateBegin).format();
            }
            if (vm.filter.assignedDateEnd != null) {
                vm.filter.assignedDateEnd = moment(vm.filter.assignedDateEnd).format();
            }
            if (vm.filter.dueDateBegin != null) {
                vm.filter.dueDateBegin = moment(vm.filter.dueDateBegin).format();
            }
            if (vm.filter.dueDateEnd != null) {
                vm.filter.dueDateEnd = moment(vm.filter.dueDateEnd).format();
            }

            vm.actionItemService.searchActionItems(vm.filter.actionItemStatusId, vm.filter.actionItemTypeId, vm.filter.assignedDateBegin, vm.filter.assignedDateEnd, vm.filter.dueDateBegin, vm.filter.dueDateEnd, vm.filter.assigneeIds, vm.filter.searchString).then(_searchActionItemsSuccess, _searchActionItemsFailure);
        }
        function _searchActionItemsSuccess(response) {
            vm.items = [];
            vm.items = response.items;
            vm.modality = false;
        }
        function _searchActionItemsFailure(error) {
            console.error(error);
        }

        function _clearFilterForm() {
            vm.filter = {};
        }
        //--------------------ACTION ITEM UPDATE--------------------

        //PUT to Complete from LayoutVm
        function _updateActionItemFromLayout() {
            vm.item.actionItemTypeId = vm.item.actionItemType.id;//Assigning from ng-model as ...Type.Id to actionItemTypeId
            vm.item.status = vm.item.actionItemStatus.id;
            vm.item.userId = vm.currentUser.id;
            vm.actionItemService.updateActionItem(vm.item).then(_putActionItemSuccessFromLayout, _putActionItemFailure);
        }
        //Specific PUT Success for LayoutVm which does not require a form
        function _putActionItemSuccessFromLayout(response) {
            vm.$onInit();
            $rootScope.$emit("LoadActionItems", {});
            $.growl({
                message: 'Action Item Updated!'
            },
            {
                type: "success"
                , placement: {
                    from: "top",
                    align: "right"
                },
                offset: {
                    x: 20,
                    y: 85
                }, spacing: 10,
                z_index: 1031,
                delay: 2500,
                timer: 1000,
            });
        }
        function _updateActionItem() {
            vm.item.actionItemTypeId = vm.item.actionItemType.id;//Assigning from ng-model as ...Type.Id to actionItemTypeId
            vm.item.status = vm.item.actionItemStatus.id;
            vm.item.userId = vm.currentUser.id;
            vm.actionItemService.updateActionItem(vm.item).then(_putActionItemSuccess, _putActionItemFailure);
        }
        function _putActionItemSuccess(response) {
            vm.aIForm.$setUntouched();
            vm.aIForm.$setPristine();
            vm.item = null;
            vm.$onInit();
            $rootScope.$emit("LoadActionItems", {}); //Emits to the Layout Controller update the Notifcation Hub
            $.growl({
                message: 'Action Item Updated!'
            },
            {
                type: "success"
                , placement: {
                    from: "top",
                    align: "right"
                },
                offset: {
                    x: 20,
                    y: 85
                }, spacing: 10,
                z_index: 1031,
                delay: 2500,
                timer: 1000,
            });
        }
        function _putActionItemFailure(error) {
            console.error(error);
        }

        //---------DELETE ACTION ITEM FXNS--------------------
        function _deleteActionItem(x) {
            swal({
                title: 'Are you sure you want to delete this Action Item?',
                text: "You won't be able to revert this!",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then(function () {
                swal(
                    'Action Item deleted!',
                    '',
                    'success'
                )
                vm.item = x;
                vm.actionItemService.deleteActionItem(vm.item.id).then(_actionItemDeleteSuccess, _actionItemDeleteError);
            }, function (dismiss) {
                    if (dismiss === 'cancel') {
                        swal(
                            'Cancelled',
                            'Your Action Item is safe :)',
                            'error')
                    }
                }
                )
        }
        function _actionItemDeleteSuccess(response) {
            vm.$onInit();
            vm.item = {};
            $rootScope.$emit("LoadActionItems", {});
        }
        function _actionItemDeleteError(error) {
            console.error(error);
        }

        //---------POST ACTION ITEM FXNS--------------------

        function _postActionItem() {
            if (vm.aIForm.$valid) {
                vm.item.actionItemTypeId = vm.item.actionItemType.id;//Assigning from ng-model as ...Type.Id to actionItemTypeId
                vm.item.status = vm.item.actionItemStatus.id;
                vm.item.userId = vm.currentUser.id;
                vm.actionItemService.postActionItem(vm.item).then(_postActionItemSuccess, _postActionItemFailure);
            }

        }
        function _postActionItemSuccess(response) {
            vm.aIForm.$setUntouched();
            vm.aIForm.$setPristine();
            vm.item = null;
            vm.$onInit();
            $rootScope.$emit("LoadActionItems", {});
            $.growl({
                message: 'Action Item Created!'
            }, {
                    type: "success"
                    , placement: {
                        from: "top",
                        align: "right"
                    },
                    offset: {
                        x: 20,
                        y: 85
                    }, spacing: 10,
                    z_index: 1031,
                    delay: 2500,
                    timer: 1000,
                });
        }
        function _postActionItemFailure(error) {
            $.growl({
                message: 'Failure!'
            }, {
                    type: "danger"
                    , placement: {
                        from: "top",
                        align: "right"
                    },
                    offset: {
                        x: 20,
                        y: 85
                    }, spacing: 10,
                    z_index: 1031,
                    delay: 2500,
                    timer: 1000,
                });
        }

        //---------DATETIMEPICKER VALIDATIONS--------------------
        //Function that checks if the Due Date is set so it can gray out a date to pick after that date
        function _startDateBeforeRender($dates) {
            if (vm.item && vm.item.dueDate) {//Checks truthiness, if DueDate is set
                var activeDate = moment(vm.item.dueDate);
                $dates.filter(function (date) {
                    return date.localDateValue() >= activeDate.valueOf()
                }).forEach(function (date) {
                    date.selectable = false;
                })
            }
        }
        //Function that checks if the assigned date is set or not so it can disable dates before it
        function _endDateBeforeRender($view, $dates) {
            if (vm.item && vm.item.assignedDate) {
                var activeDate = moment(vm.item.assignedDate).subtract(1, $view).add(1, 'minute');

                $dates.filter(function (date) {
                    return date.localDateValue() <= activeDate.valueOf()
                }).forEach(function (date) {
                    date.selectable = false;
                })
            }
        }
        //Uses $scope to broadcast that the start date is changed, which in turn triggers the end-datetimepicker to rerender
        function _startDateOnSetTime() {
            vm.$scope.$broadcast('start-date-changed');
        }
        //Uses $scope to broadcast that the end date is changed, which in turn triggers the start-datetimepicker to rerender
        function _endDateOnSetTime() {
            vm.$scope.$broadcast('end-date-changed');
        }

        //---------ASSIGNED DATETIMEPICKER VALIDATIONS--------------------
        //Function that checks if the Due Date is set so it can gray out a date to pick after that date
        function _aDateStartDateBeforeRender($dates) {
            if (vm.filter && vm.filter.assignedDateEnd) {//Checks truthiness, if DueDate is set
                var activeDate = moment(vm.filter.assignedDateEnd);
                $dates.filter(function (date) {
                    return date.localDateValue() >= activeDate.valueOf()
                }).forEach(function (date) {
                    date.selectable = false;
                })
            }
        }
        //Function that checks if the assigned date is set or not so it can disable dates before it
        function _aDateEndDateBeforeRender($view, $dates) {
            if (vm.filter && vm.filter.assignedDateBegin) {
                var activeDate = moment(vm.filter.assignedDateBegin).subtract(1, $view).add(1, 'minute');
                $dates.filter(function (date) {
                    return date.localDateValue() <= activeDate.valueOf()
                }).forEach(function (date) {
                    date.selectable = false;
                })
            }
        }
        //Uses $scope to broadcast that the start date is changed, which in turn triggers the end-datetimepicker to rerender
        function _aDateStartDateOnSetTime() {
            vm.$scope.$broadcast('ass-start-date-changed');
        }
        //Uses $scope to broadcast that the end date is changed, which in turn triggers the start-datetimepicker to rerender
        function _aDateEndDateOnSetTime() {
            vm.$scope.$broadcast('ass-end-date-changed');
        }

        //---------DUE DATETIMEPICKER VALIDATIONS--------------------

        //Function that checks if the Due Date is set so it can gray out a date to pick after that date
        function _dDateStartDateBeforeRender($dates) {
            if (vm.filter && vm.filter.dueDateEnd) {  //Checks truthiness, if DueDate is set
                var activeDate = moment(vm.filter.dueDateEnd);
                $dates.filter(function (date) {
                    return date.localDateValue() >= activeDate.valueOf()
                }).forEach(function (date) {
                    date.selectable = false;
                })
            }
        }
        //Function that checks if the assigned date is set or not so it can disable dates before it
        function _dDateEndDateBeforeRender($view, $dates) {
            if (vm.filter && vm.filter.dueDateBegin) {
                var activeDate = moment(vm.filter.dueDateBegin).subtract(1, $view).add(1, 'minute');
                $dates.filter(function (date) {
                    return date.localDateValue() <= activeDate.valueOf()
                }).forEach(function (date) {
                    date.selectable = false;
                })
            }
        }
        //Uses $scope to broadcast that the start date is changed, which in turn triggers the end-datetimepicker to rerender
        function _dDateStartDateOnSetTime() {
            vm.$scope.$broadcast('due-start-date-changed');
        }
        //Uses $scope to broadcast that the end date is changed, which in turn triggers the start-datetimepicker to rerender
        function _dDateEndDateOnSetTime() {
            vm.$scope.$broadcast('due-end-date-changed');
        }

        //---------DROPDOWN AUTO-POPULATE CALLS----------------

        function _loadAllActionItemTypes() {
            vm.actionItemService.loadAllActionItemTypes().then(_loadAllActionItemTypesSuccess, _loadAllActionItemError);
        }

        function _loadAllActionItemTypesSuccess(data) {
            vm.itemType = data;
        }

        function _loadAllActionItemError(error) {
            swal(error);
        }

        function _loadAllPersonIds() {
            vm.personBaseService.search(null, 79).then(_loadAllPersonIdsSuccess, _loadAllPersonIdsError);
        }

        function _loadAllPersonIdsSuccess(data) {
            vm.personIds = data.items;
        }

        function _loadAllPersonIdsError(error) {
            swal(error);
        }

        function _loadActionItemStatus() {

            vm.actionItemService.loadActionItemStatus().then(_loadActionItemStatusSuccess, _loadActionItemStatusFailure);
        }

        function _loadActionItemStatusSuccess(data) {
            vm.status = data.data.items;
        }

        function _loadActionItemStatusFailure(error) {
            console.error(error);
        }

        //---------HANDLERS--------------------
        function _cancelActionItem() {
            vm.aIForm.$setUntouched();
            vm.aIForm.$setPristine();
            vm.editForm = false;
            vm.newForm = false;
            vm.item = null;
            vm.$onInit($stateParams.id = null);
        }

        function _addBtn() {
            vm.editForm = false;
            vm.newForm = true;
            vm.item = null;
            vm.aIForm.$setUntouched();
        }

        //-------------These Fire Upon request from LayoutVm---------------
        $rootScope.$on("EditActionItem", function (event, x) {
            vm.editForm = true;
            vm.actionItemService.loadActionItemById(x).then(_onGetItemSuccess, _onGetItemError);
        });

        $rootScope.$on("CompleteActionItem", function (event, x) {
            vm.actionItemService.loadActionItemById(x).then(_completeActionItemSuccess, _onGetItemError).then(_updateActionItemFromLayout);
        });

        function _completeActionItemSuccess(response) {
            vm.item = response.item;
            vm.item.actionItemStatus.id = 2;
            vm.item.actionItemType.id = vm.item.actionItemType.id.toString();
            vm.item.userId = vm.item.userId.toString();
            if (vm.item.assignees) {
                vm.item.assigneeIds = vm.item.assignees.map(
                    function (value) {
                        return value.id;
                    });
            }
        }
        //^^^^^^^^^^^^^^^^These Fire Upon request from LayoutVm^^^^^^^^
        function _editList(x) {
            vm.editForm = true;
            vm.actionItemService.loadActionItemById(x.id).then(_onGetItemSuccess, _onGetItemError);
        }
        function _onGetItemSuccess(response) {
            vm.item = response.item;
            vm.item.actionItemType.id = vm.item.actionItemType.id.toString();
            vm.item.userId = vm.item.userId.toString();
            if (vm.item.assignees) {
                vm.item.assigneeIds = vm.item.assignees.map(
                    function (value) {
                        return value.id;
                    });
            }
        }
        function _onGetItemError(error) {
            console.error(error);
        }
        //---------RUNS ON PAGE LOAD--------------------
        function _onInit() {
            vm.loadAllActionItemTypes();
            vm.loadAllPersonIds();
            vm.loadActionItemStatus();
            vm.userService.getUserInfo()
                .then(_getUserInfoSuccess, _getUserInfoError);
            if ($stateParams.id) {
                vm.editForm = true;
                vm.actionItemService.loadActionItemById($stateParams.id).then(_onGetItemSuccess, _onGetItemError);
            }
        }
        function _getUserInfoSuccess(userData) {
            vm.currentUser = userData.item;
            vm.actionItemService.loadActionItems(vm.currentUser.id).then(_LoadAllSuccess, _LoadError);
        }
        function _getUserInfoError(error) {
            console.error(error);
        }
        //ON SUCCESS of the LOAD of the Action Items
        function _LoadAllSuccess(response) {
            if (response !== null) {
                vm.items = response;
            }
        }
        //ON ERROR of the LOAD of the Action Items
        function _LoadError(error) {
            console.error(error);
        }
    }
})();
