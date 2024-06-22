sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/date/UI5Date"
],
    function (Controller, UI5Date) {
        "use strict";

        return Controller.extend("hsp.doctor.controller.View1", {
            onInit: function () {
                let date = new Date();
                var yy = date.getFullYear();
                var mm = date.getMonth();
                var dd = date.getDate();
                let slots = [];
                for (let i = dd; i <= dd + 14; i++) {
                    let d = i, m = mm + 1;
                    if (d > 30) {
                        m = m + 1;
                        d = i - 30;
                    }
                    let day = new Date(yy + '-' + (m) + '-' + (d)).getDay();
                    if (day == 1 || day == 2 || day == 4 || day == 5) {
                        // let dat=d+'-'+m+'-'+yy;s
                        let dat = m + '/' + d + '/24';
                        slots.push({
                            "date": dat,
                            "slots": [
                                {
                                    "time": "9:00AM-10:00AM",
                                    "avl": 5
                                },
                                {
                                    "time": "10:00AM-11:00AM",
                                    "avl": 5
                                },
                                {
                                    "time": "11:00AM-12:00PM",
                                    "avl": 5
                                },
                                {
                                    "time": "4:00PM-5:00PM",
                                    "avl": 5
                                },
                                {
                                    "time": "5:00AM-6:00PM",
                                    "avl": 5
                                }
                            ]
                        })
                    };

                };
                this.slotsData = slots;
                this.getView().byId("idDate").setMinDate(UI5Date.getInstance(yy, mm, dd));
                this.getView().byId("idDate").setMaxDate(UI5Date.getInstance(yy, mm, dd + 14));

            },
            onClickBookAppoitment: function () {
                let name = this.getView().byId("IdPatientName").getValue();
                let date = this.getView().byId("idDate").getValue();
                let prob = this.getView().byId("IdPatientProblem").getValue();
                if (name != '' && date != '' && prob != '') {
                    let slot = this.getView().byId("IdSlot").getSelectedItem().getText();
                    let data = this.getView().getModel("slotsModel").getData();
                    var objSts = false;
                    // var dupSts= true;
                    var dupSts = this.inspectPatient(name);
                    for (let j = 0; j < this.slotsData.length; j++) {
                        if (this.slotsData[j].date == date) {
                            for (let k = 0; k < this.slotsData[j].slots.length; k++) {
                                if (this.slotsData[j].slots[k].time == slot && this.slotsData[j].slots[k].avl > 0) {
                                    this.slotsData[j].slots[k].avl--;
                                    objSts = true;
                                }
                            }
                        }
                    }
                    if (objSts && dupSts) {
                        data.push({
                            "Name": name,
                            "Date": date,
                            "Slot": slot,
                            "Prob": prob
                        });
                        this.getView().getModel("slotsModel").setData(data);
                        new sap.m.MessageToast.show("Appointment Succesfully scheduled");
                        this.getView().setModel(new sap.ui.model.json.JSONModel(this.slotsData), "sDetails");
                        this.getView().getModel("mSlots").refresh();
                    }
                }
                else {
                    sap.m.MessageBox.warning("Please Fill all Mandatory Fields and Try Again", {
                        title: "Warning"
                    });
                }
            },
            onClickDate: function (oEvent) {
                let match = false;
                var obj;
                for (let j = 0; j < this.slotsData.length; j++) {
                    if (this.slotsData[j].date == oEvent.getSource().getValue()) {
                        match = true;
                        obj = this.slotsData[j];
                    }
                }
                if (match) {
                    this.getView().setModel(new sap.ui.model.json.JSONModel([obj]), "mSlots");
                    this.getView().byId("idDate").setValueState("Success");
                }
                else {
                    this.getView().setModel(new sap.ui.model.json.JSONModel([{ "slots": [{}] }]), "mSlots");
                    this.getView().byId("idDate").setValueState("Warning");
                    sap.m.MessageBox.alert("Doctor is not available", {
                        title: "Alert"
                    })
                }
            },
            inspectPatient: function (val) {
                let dsa = this.getView().getModel("slotsModel").getData();
                let g = "S";
                dsa.forEach(element => {
                    if (element.Name == val) {
                        g = "N";
                    }
                });
                if (g == 'S') {
                    return true;
                } else {
                    return false;
                }
            },
            openAppoitments: function () {
                this.getView().byId('idAppoitments').open();
            },
            openSlots: function () {
                var slt = [];

                for (let j = 0; j < this.slotsData.length; j++) {

                    for (let k = 0; k < this.slotsData[j].slots.length; k++) {
                        let obj = {};
                        obj["date"] = this.slotsData[j].date;
                        obj["time"] = this.slotsData[j].slots[k].time;
                        obj["avl"] = this.slotsData[j].slots[k].avl;
                        slt.push(obj);
                    }

                }
                this.getView().setModel(new sap.ui.model.json.JSONModel(slt), "SAVD");
                this.getView().byId('idSlots').open();
            },
            onClose: function (e) {
                e.getSource().getParent().close();
            }
        });
    });
