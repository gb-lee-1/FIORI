sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    'sap/ui/core/Fragment',
    "sap/ui/model/json/JSONModel",
    'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator',
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageToast, Fragment, JSONModel, Filter, FilterOperator) {
        "use strict";

        return Controller.extend("project1.controller.View1", {
            onInit: function () {
                var oModel = new JSONModel({
                    ValueHelpData : [
                        { Name : "test1 sample", Desc : "설명1"},
                        { Name : "test2", Desc : "설명2"},
                        { Name : "test3", Desc : "설명3"}
                    ],
                    value : null
                });

                this.getView().setModel(oModel, "view")
            },

            onInputChange : function(oEvent) {
                var sValue = oEvent.getParameter("value");
                MessageToast.show(sValue)
            },

            onSubmit : function (oEvent) {
                var sValue = oEvent.getParameter("value");
                MessageToast.show(sValue)
            },

            onLiveChange : function (oEvent) {
                var sValue = oEvent.getParameter("value"),
                    bEsc = oEvent.getParameter("escPressed"),
                    sPrevious = oEvent.getParameter("previousValue");

                var sModelValue = this.getView().getModel("view").getProperty("/value")
                
                MessageToast.show(sValue + "\n" + bEsc + "\n" + sPrevious + "\n" + sModelValue)
            },

            onLiveChange2 : function (oEvent) {
                // 입력한 비밀번호 길이가 10자리 미만일 경우 메세지토스트로 알려주기
                // .length 
                var sValue = oEvent.getParameter("value"),
                    iLength = sValue.length; // 입력한 문자열의 길이

                var oInput = oEvent.getSource();

                if (iLength < 10) {
                    // MessageToast.show("비밀번호 길이는 10자 이상입니다")
                    oInput.setValueState("Error");
                    oInput.setValueStateText("비밀번호 길이는 10자 이상입니다");
                } else {
                    oInput.setValueState("Information");
                    oInput.setValueStateText("올바른 비밀번호입니다");
                }
            },

            handleValueHelp : function (oEvent) {
                var oView = this.getView();
                // this._sInputId = oEvent.getSource().getId();
                this._oInput = oEvent.getSource();
                var sValue = oEvent.getSource().getValue();
        
                // create value help dialog
                if (!this._pValueHelpDialog) {
                    this._pValueHelpDialog = Fragment.load({
                        id: oView.getId(),
                        name: "project1.view.Dialog",
                        controller: this
                    }).then(function(oValueHelpDialog){
                        oView.addDependent(oValueHelpDialog);
                        return oValueHelpDialog;
                    });
                }
        
                // open value help dialog
                this._pValueHelpDialog.then(function(oValueHelpDialog){
                    oValueHelpDialog.open();
                    oValueHelpDialog._searchField.setValue(sValue);
                    // 입력창에 들어있는 값을 검색창에 복사
                });
            },

            _handleValueHelpSearch : function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter(
                    "Name",
                    FilterOperator.Contains, sValue
                );
                oEvent.getSource().getBinding("items").filter([oFilter]);
            },
        
            _handleValueHelpClose : function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                if (oSelectedItem) {
                    var oInput = this._oInput;
                    oInput.setValue(oSelectedItem.getTitle());
                }
                oEvent.getSource().getBinding("items").filter([]);
            },

            onSuggest : function(oEvent) {
                var sTerm = oEvent.getParameter("suggestValue");
                var aFilters = [];
                if (sTerm) {
                    aFilters.push(new Filter("Name", FilterOperator.Contains, sTerm));
                }

                oEvent.getSource().getBinding("suggestionItems").filter(aFilters);
            }
        });
    });
