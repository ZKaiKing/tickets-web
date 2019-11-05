<style lang="less">
	@import './no-develop.less';
</style>

<template>
	<div class="no-develop">
		<div class="body-con">
			<Card>
				<div class="body-con-title">开发中...</div>
				<p class="body-con-message">In&nbsp;&nbsp;development</p>
				<div class="btn-con">
					<Button @click="goHome" size="large" style="width: 200px;" type="text">返回首页</Button>
					<Button @click="backPage" size="large" style="width: 200px;margin-left: 40px;" type="primary">返回上一页</Button>
				</div>
			</Card>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'NoDevelop',
		methods: {
			backPage() {
				this.$router.go(-1);
			},
			goHome() {
				this.$router.push({
					path: 'home'
				});
			}
		}
	};
</script>
