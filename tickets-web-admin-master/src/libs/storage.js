/**
 * 存储localStorage
 */
export const setStore = (name, content) => {
	if (!name) return;
	if (typeof content !== 'string') {
		content = JSON.stringify(content);
	}
	window.localStorage.setItem(name, content);
}

/**
 * 获取localStorage
 */
export const getStore = name => {
	if (!name) return;
	return window.localStorage.getItem(name);
}

/**
 * 删除localStorage
 */
export const removeStore = name => {
	if (!name) return;
	window.localStorage.removeItem(name);
}



/**
 * 操作sessionStorage
 */
export const sessionStore = new function() {
	this.storage = window.sessionStorage,
		this.setItem = function(key, value) {
			if (typeof(value) != 'string') {
				this.storage.setItem(key, JSON.stringify(value))
				return;
			}
			this.storage.setItem(key, value)
		},
		this.getItem = function(key) {
			let tempValue = this.storage.getItem(key)
			let objValue;
			try {
				objValue = JSON.parse(tempValue)
			} catch (err) {
				return tempValue
			}
			if (typeof(objValue) == 'function' || typeof(objValue) == 'object')
				return objValue
			return tempValue
		},
		this.removeItem = function(key) {
			if (!key) return;
			this.storage.removeItem(key);
		},
		this.clear = function() {
			this.storage.clear()
		}
}

/**
 * 操作localStorage
 */
export const localStore = new function() {
	
	this.storage = window.localStorage,
		this.setItem = function(key, value) {
			if (typeof(value) != 'string') {
				this.storage.setItem(key, JSON.stringify(value))
				return;
			}
			this.storage.setItem(key, value)
		},
		this.getItem = function(key) {
			let tempValue = this.storage.getItem(key)
			let objValue;
			try {
				objValue = JSON.parse(tempValue)
			} catch (err) {
				return tempValue
			}
			if (typeof(objValue) == 'function' || typeof(objValue) == 'object')
				return objValue
			return tempValue
		},
		this.removeItem = function(key) {
			if (!key) return;
			this.storage.removeItem(key);
		},
		this.clear = function() {
			this.storage.clear()
		},
		this.setAuthorization = function(value) {
			this.setItem("accessToken", value)
		},
		this.getAuthorization = function() {
			return this.getItem("accessToken")
		},
		
		this.setLastRoute = function(value) {
			this.setItem("lastRoute", value)
		},
		this.getLastRoute = function() {
			return this.getItem("lastRoute")
		}
}
