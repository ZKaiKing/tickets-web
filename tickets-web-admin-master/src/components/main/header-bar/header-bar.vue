<template>
	<div class="header-bar">
		<sider-trigger :collapsed="collapsed" icon="md-menu" @on-change="handleCollpasedChange"></sider-trigger>
		<custom-bread-crumb show-icon style="margin-left: 30px;" :list="breadCrumbList"></custom-bread-crumb>
		<div class="custom-content-con">
			<Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
				<Dropdown transfer trigger="hover" @on-click="handleClickUserDropdown">
					<a href="javascript:void(0)">
						<span class="main-user-name">{{ username }}</span>
						<Icon type="md-arrow-dropdown" />
						<Avatar style="background: #619fe7;margin-left: 10px;">{{username.charAt(0)}}</Avatar>
					</a>
					<DropdownMenu slot="list">
						<DropdownItem name="modifyPassword">修改密码</DropdownItem>
						<DropdownItem name="logout" divided>退出登录</DropdownItem>
					</DropdownMenu>
				</Dropdown>
			</Row>
		</div>
		<Modal title="修改密码" v-model="isShowUpdatePassModel" :mask-closable="false" :width="500">
			<Row>
				<Form ref="updatePassForm" :model="updatePassForm" inline :label-width="100" :rules="rules">
					<FormItem label="原密码：" prop="password">
						<Input type="password" v-model="updatePassForm.password" prefix="ios-lock" size="large" class="pass-input"
						 clearable placeholder="请输入密码" autocomplete="off" />
					</FormItem>
					<FormItem label="新密码：" prop="newPass">
						<Input type="password" v-model="updatePassForm.newPass" prefix="ios-lock" size="large" class="pass-input"
						 clearable placeholder="请输入新密码" autocomplete="off" />
					</FormItem>
					<FormItem label="确认密码：" prop="affirmPass">
						<Input type="password" v-model="updatePassForm.affirmPass" prefix="ios-lock" size="large" class="pass-input"
						 clearable placeholder="请确认密码" autocomplete="off" />
					</FormItem>
				</Form>
			</Row>
			<div slot="footer">
				<Button type="text" @click="closeUpdatePassModel">取消</Button>
				<Button type="primary" @click="updatePassword()">提交</Button>
			</div>
		</Modal>
	</div>
</template>
<script>
	import siderTrigger from "./sider-trigger";
	import customBreadCrumb from "./custom-bread-crumb";
	import {
		localStore
	} from "@/libs/storage.js";
	import {
		updatePassword,
		logout
	} from "@/api/index";
	import "./header-bar.less";
	export default {
		name: "HeaderBar",
		components: {
			siderTrigger,
			customBreadCrumb
		},
		data() {
			return {
				isShowUpdatePassModel: false,
				updatePassForm: {
					password: "",
					newPass: "",
					affirmPass: ""
				},
				rules: {
					password: [{
						required: true,
						message: "密码不能为空",
						trigger: "blur"
					}],
					newPass: [{
						required: true,
						message: "新密码不能为空",
						trigger: "blur"
					}],
					affirmPass: [{
						required: true,
						message: "确认密码不能为空",
						trigger: "blur"
					}],
				}
			}
		},
		props: {
			collapsed: Boolean,
			username: String
		},
		computed: {
			breadCrumbList() {
				// return this.$store.state.app.breadCrumbList
				// return
			}
		},
		methods: {
			handleCollpasedChange(state) {
				this.$emit("on-coll-change", state);
			},
			handleClickUserDropdown(name) {
				if (name == "modifyPassword") {
					this.isShowUpdatePassModel = true
					this.$refs.updatePassForm.resetFields()
				} else if (name == "logout") {
					this.logout()
				}
			},
			updatePassword() {
				const self = this


				self.$refs.updatePassForm.validate((valid) => {
					if (!valid) {
						return;
					}
					if (self.updatePassForm.newPass !== self.updatePassForm.affirmPass) {
						self.$Message.warning("两次输入密码不一致");
						return;
					}
					updatePassword(self.updatePassForm).then(res => {
						if (res.resultCode == "SUCCESS" || res.code == 200) {
							self.$Message.success("修改成功");
							self.$refs.updatePassForm.resetFields();
							self.closeUpdatePassModel()
						}
					})
				})
			},
			logout() {
				const self = this
				logout().then(res => {
					localStore.clear()
					self.$router.push({
						path: "/login"
					})
				})
			},
			closeUpdatePassModel() {
				this.isShowUpdatePassModel = false
			},
			resetForm(refName) {
				self.$refs[refName].resetFields()
			}
		}
	};
</script>
<style scoped>
	.pass-input {
		width: 250px;
	}
</style>
