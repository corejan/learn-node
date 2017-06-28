/**
 * 权限控制模块
 * 
 * 说明：
 * 	权限是通过查找用户具有的功能点（由用户所属角色确定）以及该功能点对应的具体操作权限来确定的。
 * 	操作权限分为三个等级，guest、owner、admin，具体含义可参见hasPermission中的注释。
 */

/*
 * 遍历权限配置，返回用户是否具有权限
 * 为简化配置文件若配置中没有找到对应项则认为具有权限（不做权限控制）
 * 
 * 参数：
 * 	module: 功能模块
 * 	resource: 资源类型
 * 	action: 对资源采取的操作
 * 	userId: 当前用户ID
 * 	userFunc: 当前用户具有的功能点
 * 	record: 所要操作的资源数据
 * 	config: 功能点与具体操作的对应关系
 */
function hasPermission(module, resource, action, userId, userFunc, record, config) {
	var result = _findPermission(module, resource, action, config);
	var foundModule = result[0];
	var foundResource = result[1];
	var foundPermission = result[2];

	//adminCode对应于数据库Base_FunctionModule表中的FunctionCode字段
	//此属性可在resource段或permission段中定义，
	//  若定义在resource中即默认其下所有的permission都归属于这个功能点，
	//  若定义在permission中则表示功能点仅对此permission有效，
	//  若同时定义，则以permission中的为准
	var adminCode = foundPermission['adminCode'];
	if(!adminCode) {
		adminCode = foundResource['adminCode'];
	}

	switch(foundPermission.atLeast) {
		case 'guest':
			//任何人都有权限，不用判断
			return true;
		case 'owner':
			//只有记录的创建者或具有功能点权限的人才能操作
			if(record.UserID == userId) {
				return true;
			}

			if(adminCode && userFunc.indexOf(adminCode)>=0) {
				return true;
			} else {
				return false;
			}
		case 'admin':
			//仅具有功能点权限的人可以操作，
			//由于admin会有所有权限点，因此对于admin不做单独判断
			if(adminCode && userFunc.indexOf(adminCode)>=0) {
				return true;
			} else {
				return false;
			}
	}
}

//------------------以下为辅助函数--------------------
function _findPermission(module, resource, action, config) {
	var useDefault = [false, true];
	for(var i in useDefault) {
		var md = useDefault[i];
		var vFoundModule = _findItem(config, 'module', module, md);
		if(!vFoundModule) {
			continue;
		}

		for(var j in useDefault) {
			var rd = useDefault[j];
			var vFoundResource = _findItem(vFoundModule.resources, 'type', resource, rd);
			if(!vFoundResource) {
				continue;
			}

			for(var k in useDefault) {
				var pd = useDefault[k];
				var vFoundPermission = _findItem(vFoundResource.permissions, 'action', action, pd);
				if(!vFoundPermission) {
					continue;
				}

				return [vFoundModule, vFoundResource, vFoundPermission];
			}
		}
	}

	return [null, null, null];
}

function _findItem(list, key, value, useDefault) {
	if(useDefault) {
		for(var i in list) {
			var item = list[i];
			if(item[key] == '*') {
				return item;
			}
		};
	} else {
		for(var i in list) {
			var item = list[i];
			if(item[key] == value) {
				return item;
			}

			var parts = item[key].split(',');
			for(var j in parts) {
				var part = parts[j];
				if(part == value) {
					return item;
				}
			};
		};
	}

	return null;
}