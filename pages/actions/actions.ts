import { Selector } from "testcafe";

async function get_api_devices(t: TestController) {
  const results = await t.request("http://localhost:3000/devices");

  //console.log(results);
  const json_devices = JSON.parse(JSON.stringify(await results.body));
  let map_api_devices = new Map();

  for await (const device of json_devices) {
    //console.log(device);
    map_api_devices.set(device.system_name, [
      device.system_name,
      device.type,
      device.hdd_cacacity,
    ]);
  }
  return map_api_devices;
}
async function get_ui_devices() {
  let map_ui_devices = new Map();
  let ui_name: String, ui_type: String, ui_capacity: String;
  const list_devices = Selector(
    "div.list-devices div.device-main-box div.device-info"
  );

  for (let i = 0; i <= (await list_devices.count) - 1; i++) {
    ui_name = await list_devices.nth(i).child("span.device-name").innerText;
    ui_type = await list_devices.nth(i).child("span.device-type").innerText;
    ui_capacity = await list_devices.nth(i).find("span.device-capacity")
      .innerText;

    map_ui_devices.set(ui_name, [ui_name, ui_type, ui_capacity]);
  }
  return map_ui_devices;
}
async function compare_ui_vs_api_devices(
  map_api_devices: Map<String, Array<String>>,
  map_ui_devices: Map<String, Array<String>>,t:TestController
) {
  const arr_keys_api_devices = map_api_devices.keys();
  let isCorrect: boolean;
  let ui_type: String, ui_capacity: String, ui_name: String;
  let api_name: String, api_type: String, api_capacity: String;

  if (map_api_devices.size === map_ui_devices.size) {
    for await (let key of arr_keys_api_devices) {
      isCorrect = false;

      if (map_ui_devices.has(key)) {
        let arr_ui_device = map_ui_devices.get(key);
        let arr_api_device = map_ui_devices.get(key);

        if (arr_ui_device && arr_api_device) {
          //UI Elements
          ui_name = arr_ui_device[0];
          ui_type = arr_ui_device[1];
          ui_capacity = arr_ui_device[2];

          //API Elements
          api_name = arr_api_device[0];
          api_type = arr_api_device[1];
          api_capacity = arr_api_device[2];

          if (ui_name === api_name) {
            if ((ui_type = api_type)) {
              if (ui_capacity === api_capacity) {
                isCorrect = true;
                /*
                console.log(
                  "***" +
                    ui_name +
                    "***" +
                    "\n" +
                    ui_name +
                    " = " +
                    api_name +
                    "\n" +
                    ui_type +
                    " = " +
                    api_type +
                    "\n" +
                    ui_capacity +
                    " = " +
                    api_capacity
                    
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
        map_api_devices.size +
        ")" +
        " y UI(" +
        map_ui_devices.size +
        " son distintos"
    );
  }
}
async function validate_edit_remove_buttons(t: TestController) {
  const list_devices = Selector(
    "div.list-devices div.device-main-box div.device-options"
  );
  let btn_edit: boolean;
  let btn_remove: boolean;

  for (let i = 0; i <= (await list_devices.count) - 1; i++) {
    btn_edit = await list_devices.nth(i).child("a.device-edit").exists;
    btn_remove = await list_devices.nth(i).child("button.device-remove").exists;

    await t.expect(true).eql(btn_edit);
    await t.expect(true).eql(btn_remove);
  }
}
export {
  get_api_devices,
  get_ui_devices,
  compare_ui_vs_api_devices,
  validate_edit_remove_buttons,
};
