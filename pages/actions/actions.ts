import { Selector } from "testcafe";

async function getAPIDevi(t: TestController) {
  const results = await t.request("http://localhost:3000/devices");

  //console.log(results);
  const jsonDevices = JSON.parse(JSON.stringify(await results.body));
  let mapAPIDEvices = new Map();

  for await (const device of jsonDevices) {
    //console.log(device);
    mapAPIDEvices.set(device.systemName, [
      device.systemName,
      device.type,
      device.hddCapacity,
    ]);
  }
  return mapAPIDEvices;
}
async function getUIDevices() {
  let mapUIDevices = new Map();
  let uiName: String, uiType: String, uiCapacity: String;
  const listDevices = Selector(
    "div.list-devices div.device-main-box div.device-info"
  );

  for (let i = 0; i <= (await listDevices.count) - 1; i++) {
    uiName = await listDevices.nth(i).child("span.device-name").innerText;
    uiType = await listDevices.nth(i).child("span.device-type").innerText;
    uiCapacity = await listDevices.nth(i).find("span.device-capacity")
      .innerText;

    mapUIDevices.set(uiName, [uiName, uiType, uiCapacity]);
  }
  return mapUIDevices;
}
async function compareUIAPIDevices(
  mapAPIDEvices: Map<String, Array<String>>,
  mapUIDevices: Map<String, Array<String>>,
  t: TestController
) {
  const arrKeysAPIDevices = mapAPIDEvices.keys();
  let isCorrect: boolean;
  let uiType: String, uiCapacity: String, uiName: String;
  let apiName: String, apiType: String, apiCapacity: String;

  if (mapAPIDEvices.size === mapUIDevices.size) {
    for await (let key of arrKeysAPIDevices) {
      isCorrect = false;

      if (mapUIDevices.has(key)) {
        let arrUIDevice = mapUIDevices.get(key);
        let arrAPIDevice = mapUIDevices.get(key);

        if (arrUIDevice && arrAPIDevice) {
          //UI Elements
          uiName = arrUIDevice[0];
          uiType = arrUIDevice[1];
          uiCapacity = arrUIDevice[2];

          //API Elements
          apiName = arrAPIDevice[0];
          apiType = arrAPIDevice[1];
          apiCapacity = arrAPIDevice[2];

          if (uiName === apiName) {
            if ((uiType = apiType)) {
              if (uiCapacity === apiCapacity) {
                isCorrect = true;
                /*
                console.log(
                  "***" +
                    uiName +
                    "***" +
                    "\n" +
                    uiName +
                    " = " +
                    apiName +
                    "\n" +
                    uiType +
                    " = " +
                    apiType +
                    "\n" +
                    uiCapacity +
                    " = " +
                    apiCapacity
                    
                );*/
              }
            }
          }
          await t.expect(true).eql(isCorrect);
        }
      }
    }
  } else {
    console.log(
      "El número de elementos de API (" +
        mapAPIDEvices.size +
        ")" +
        " y UI(" +
        mapUIDevices.size +
        " son distintos"
    );
  }
}
async function validateEditRemoveButtons(t: TestController) {
  const listDevices = Selector(
    "div.list-devices div.device-main-box div.device-options"
  );
  let btnEdit: boolean;
  let btnRemove: boolean;

  for (let i = 0; i <= (await listDevices.count) - 1; i++) {
    btnEdit = await listDevices.nth(i).child("a.device-edit").exists;
    btnRemove = await listDevices.nth(i).child("button.device-remove").exists;

    await t.expect(true).eql(btnEdit);
    await t.expect(true).eql(btnRemove);
  }
}
async function renameSystem(t:TestController, idDevice: String) {
  const resp = await t.request.put({
    url: "http://localhost:3000/devices/" + idDevice,
    headers: {
      "Content-Type": "application/json",
    },
    body: {
      id: idDevice,
      systemName: "Rename Device",
      type: "WINDOWS",
      hdd_capacity: "10",
    },
  });
}
async function deleteRegister(t:TestController,idDevice:String) {
  const resp = await t.request.delete({
    url: "http://localhost:3000/devices/" + idDevice,
  });
}
export {
  getAPIDevi,
  getUIDevices,
  compareUIAPIDevices,
  validateEditRemoveButtons,
  renameSystem,
  deleteRegister,
};
