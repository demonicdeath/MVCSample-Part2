var directiveModule = angular.module('angularjs-dropdown-multiselect', []);

directiveModule.directive('ngDropdownMultiselect', ['$filter', '$document', '$compile', '$parse',

function ($filter, $document, $compile, $parse) {

    return {
        restrict: 'AE',
        scope: {
            selectedModel: '=',
            options: '=',
            extraSettings: '=',
            events: '=',
            searchFilter: '=?',
            translationTexts: '=',
            groupBy: '@'
        },
        template: function (element, attrs) {
            var checkboxes = attrs.checkboxes ? true : false;
            var groups = attrs.groupBy ? true : false;

            var template = '<div class="multiselect-parent btn-group dropdown-multiselect right">';
            template += '<a class="btn orange darken-3 right" ng-class="settings.buttonClasses" ng-click="toggleDropdown()"><i class="material-icons right">search</i> Search</a>';
            template += '<div class="dropdown-menu dropdown-menu-form" ng-style="{display: open ? \'block\' : \'none\'}" style="overflow: scroll" >';
            template += '<div class="row">'
                template += '<div class="col s6" ng-hide="!settings.showCheckAll || settings.selectionLimit > 0"><a data-ng-click="selectAll()" class="btn modify-width"><i class="material-icons left">check_box</i>All</a></div>';
                template += '<div class="col s6" ng-show="settings.showUncheckAll"><a data-ng-click="deselectAll();" class="btn modify-width"><i class="material-icons left">cancel</i>All</a></div>';
            template += '</div>';

            template += '<div class="search-wrapper card row" ng-show="settings.enableSearch">';
                template += '<div class="col s12"><input ng-model="searchFilter" placeholder="Search Product Name"><a class="modal-trigger" href="#modal1"><i class="material-icons">search</i></a></div>';
            template += '</div>';
            
            if (groups) {
                template += '<div ng-repeat-start="option in orderedItems | filter: searchFilter" ng-show="getPropertyForObject(option, settings.groupBy) !== getPropertyForObject(orderedItems[$index - 1], settings.groupBy)" role="presentation" class="dropdown-header">{{ getGroupTitle(getPropertyForObject(option, settings.groupBy)) }}</div>';
                template += '<div ng-repeat-end role="presentation">';
            } else {
                template += '<div role="presentation" ng-repeat="option in options | filter: searchFilter">';
            }

            template += '<a role="menuitem" tabindex="-1" ng-click="setSelectedItem(getPropertyForObject(option,settings.idProp))">';

            if (checkboxes) {
                template += '<div class="checkbox"><input type="checkbox" ng-click="checkboxClick($event, getPropertyForObject(option,settings.idProp))" ng-checked="isChecked(getPropertyForObject(option,settings.idProp))" /> <label>{{getPropertyForObject(option, settings.displayProp)}}</label></div></a>';
            } else {
                template += '<i data-ng-class="{\'glyphicon glyphicon-ok\': isChecked(getPropertyForObject(option,settings.idProp))}"></i> {{getPropertyForObject(option, settings.displayProp)}}</a>';
            }

            template += '</div>';

            template += '<div class="divider" ng-show="settings.selectionLimit > 1"></div>';
            template += '<div role="presentation" ng-show="settings.selectionLimit > 1"><a role="menuitem">{{selectedModel.length}} {{texts.selectionOf}} {{settings.selectionLimit}} {{texts.selectionCount}}</a></div>';

            template += '</div>';
            template += '</div>';

            element.html(template);
        },

        link: function ($scope, $element, $attrs) {
            var $dropdownTrigger = $element.children()[0];

            $scope.toggleDropdown = function () {
                $scope.open = !$scope.open;
            };

            $scope.checkboxClick = function ($event, id) {
                $scope.setSelectedItem(id);
                $event.stopImmediatePropagation();
            };

            $scope.externalEvents = {
                onItemSelect: angular.noop,
                onItemDeselect: angular.noop,
                onSelectAll: angular.noop,
                onDeselectAll: angular.noop,
                onInitDone: angular.noop,
                onMaxSelectionReached: angular.noop
            };

            $scope.settings = {
                dynamicTitle: true,
                scrollable: false,
                scrollableHeight: '300px',
                closeOnBlur: true,
                displayProp: 'name',
                idProp: 'id',
                externalIdProp: 'id',
                enableSearch: false,
                selectionLimit: 0,
                showCheckAll: true,
                showUncheckAll: true,
                closeOnSelect: false,
                buttonClasses: 'btn btn-default',
                closeOnDeselect: false,
                groupBy: $attrs.groupBy || undefined,
                groupByTextProvider: null,
                smartButtonMaxItems: 0,
                smartButtonTextConverter: angular.noop
            };

            $scope.texts = {
                checkAll: 'Check All',
                uncheckAll: 'Uncheck All',
                selectionCount: 'checked',
                selectionOf: '/',
                searchPlaceholder: 'Search...',
                buttonDefaultText: 'Select',
                dynamicButtonTextSuffix: 'checked'
            };

            $scope.searchFilter = $scope.searchFilter || '';

            if (angular.isDefined($scope.settings.groupBy)) {
                $scope.$watch('options', function (newValue) {
                    if (angular.isDefined(newValue)) {
                        $scope.orderedItems = $filter('orderBy')(newValue, $scope.settings.groupBy);
                    }
                });
            }

            angular.extend($scope.settings, $scope.extraSettings || []);
            angular.extend($scope.externalEvents, $scope.events || []);
            angular.extend($scope.texts, $scope.translationTexts);

            $scope.singleSelection = $scope.settings.selectionLimit === 1;

            function getFindObj(id) {
                var findObj = {};

                if ($scope.settings.externalIdProp === '') {
                    findObj[$scope.settings.idProp] = id;
                } else {
                    findObj[$scope.settings.externalIdProp] = id;
                }

                return findObj;
            }

            function clearObject(object) {
                for (var prop in object) {
                    delete object[prop];
                }
            }

            if ($scope.singleSelection) {
                if (angular.isArray($scope.selectedModel) && $scope.selectedModel.length === 0) {
                    clearObject($scope.selectedModel);
                }
            }

            if ($scope.settings.closeOnBlur) {
                $document.on('click', function (e) {
                    var target = e.target.parentElement;
                    var parentFound = false;

                    while (angular.isDefined(target) && target !== null && !parentFound) {
                        if (_.contains(target.className.split(' '), 'multiselect-parent') && !parentFound) {
                            if (target === $dropdownTrigger) {
                                parentFound = true;
                            }
                        }
                        target = target.parentElement;
                    }

                    if (!parentFound) {
                        $scope.$apply(function () {
                            $scope.open = false;
                        });
                    }
                });
            }

            $scope.getGroupTitle = function (groupValue) {
                if ($scope.settings.groupByTextProvider !== null) {
                    return $scope.settings.groupByTextProvider(groupValue);
                }

                return groupValue;
            };

            // $scope.getButtonText = function () {
            //     if ($scope.settings.dynamicTitle && ($scope.selectedModel.length > 0 || (angular.isObject($scope.selectedModel) && _.keys($scope.selectedModel).length > 0))) {
            //         if ($scope.settings.smartButtonMaxItems > 0) {
            //             var itemsText = [];

            //             angular.forEach($scope.options, function (optionItem) {
            //                 if ($scope.isChecked($scope.getPropertyForObject(optionItem, $scope.settings.idProp))) {
            //                     var displayText = $scope.getPropertyForObject(optionItem, $scope.settings.displayProp);
            //                     var converterResponse = $scope.settings.smartButtonTextConverter(displayText, optionItem);

            //                     itemsText.push(converterResponse ? converterResponse : displayText);
            //                 }
            //             });

            //             if ($scope.selectedModel.length > $scope.settings.smartButtonMaxItems) {
            //                 itemsText = itemsText.slice(0, $scope.settings.smartButtonMaxItems);
            //                 itemsText.push('...');
            //             }

            //             return itemsText.join(', ');
            //         } else {
            //             var totalSelected;

            //             if ($scope.singleSelection) {
            //                 totalSelected = ($scope.selectedModel !== null && angular.isDefined($scope.selectedModel[$scope.settings.idProp])) ? 1 : 0;
            //             } else {
            //                 totalSelected = angular.isDefined($scope.selectedModel) ? $scope.selectedModel.length : 0;
            //             }

            //             if (totalSelected === 0) {
            //                 return $scope.texts.buttonDefaultText;
            //             } else {
            //                 return totalSelected + ' ' + $scope.texts.dynamicButtonTextSuffix;
            //             }
            //         }
            //     } else {
            //         return $scope.texts.buttonDefaultText;
            //     }
            // };

            $scope.getPropertyForObject = function (object, property) {
                if (angular.isDefined(object) && object.hasOwnProperty(property)) {
                    return object[property];
                }

                return '';
            };

            $scope.selectAll = function () {
                $scope.deselectAll(false);
                $scope.externalEvents.onSelectAll();

                angular.forEach($scope.options, function (value) {
                    $scope.setSelectedItem(value[$scope.settings.idProp], true);
                });
            };

            $scope.deselectAll = function (sendEvent) {
                sendEvent = sendEvent || true;

                if (sendEvent) {
                    $scope.externalEvents.onDeselectAll();
                }

                if ($scope.singleSelection) {
                    clearObject($scope.selectedModel);
                } else {
                    $scope.selectedModel.splice(0, $scope.selectedModel.length);
                }
            };

            $scope.setSelectedItem = function (id, dontRemove) {
                var findObj = getFindObj(id);
                var finalObj = null;

                if ($scope.settings.externalIdProp === '') {
                    finalObj = _.find($scope.options, findObj);
                } else {
                    finalObj = findObj;
                }

                if ($scope.singleSelection) {
                    clearObject($scope.selectedModel);
                    angular.extend($scope.selectedModel, finalObj);
                    $scope.externalEvents.onItemSelect(finalObj);
                    if ($scope.settings.closeOnSelect) $scope.open = false;

                    return;
                }

                dontRemove = dontRemove || false;

                var exists = _.findIndex($scope.selectedModel, findObj) !== -1;

                if (!dontRemove && exists) {
                    $scope.selectedModel.splice(_.findIndex($scope.selectedModel, findObj), 1);
                    $scope.externalEvents.onItemDeselect(findObj);
                } else if (!exists && ($scope.settings.selectionLimit === 0 || $scope.selectedModel.length < $scope.settings.selectionLimit)) {
                    $scope.selectedModel.push(finalObj);
                    $scope.externalEvents.onItemSelect(finalObj);
                }
                if ($scope.settings.closeOnSelect) $scope.open = false;
            };

            $scope.isChecked = function (id) {
                if ($scope.singleSelection) {
                    return $scope.selectedModel !== null && angular.isDefined($scope.selectedModel[$scope.settings.idProp]) && $scope.selectedModel[$scope.settings.idProp] === getFindObj(id)[$scope.settings.idProp];
                }

                return _.findIndex($scope.selectedModel, getFindObj(id)) !== -1;
            };

            $scope.externalEvents.onInitDone();
        }
    };
}]);