<template>
  <div>
    <Card>
      <!-- input search start -->
      <Row>
        <Form ref="searchForm" :model="searchForm" inline :label-width="90" class="search-form">
          <Form-item label="门票名称" prop="ticketName" >
            <Input type="text" v-model="searchForm.ticketName" clearable placeholder="请输入搜索内容" style="width: 200px" />
          </Form-item>
          <Form-item label="状态" prop="publishState">
            <Select v-model="searchForm.publishState" placeholder="请选择" clearable style="width: 200px">
              <Option value=1>已上架</Option>
              <Option value=0>已下架</Option>
            </Select>
          </Form-item>
          <Form-item label="时间" prop="dealTime">
            <DatePicker ref="dateTimePicker" placement='top-start' type="daterange" split-panels placeholder="请选择年月日" @on-change="selectDate" clearable class="input"></DatePicker>
          </Form-item>
          <Form-item  style="margin-left:0px;" class="br">
              <Button @click="addData" type="success" ghost icon="ios-add" >新增</Button>
            <Button @click="handleSearch" type="primary" icon="ios-search" style="margin-left: 8px">搜索</Button>
            <Button @click="handleReset" type="primary" ghost icon="md-remove-circle" style="margin-left: 8px">重置</Button>
          </Form-item>
        </Form>
      </Row>
      <!-- input search end -->

      <!-- data table start -->
      <Row>
        <Table border ref="table" :columns="columns" :data="tableData" :loading="loading" @on-selection-change="saveSelect">
          <template slot-scope="{ row }" slot="publishState">
            <Badge v-if="row.publishState === true" status="success" text="已上架" />
            <Badge v-else-if="row.publishState === false" status="error" text="已下架/未上架" />
            <Badge v-else status="success" text="--" />
          </template>
          <template slot-scope="{ row }" slot="publishTime">
            {{row.minStartTime}}~{{row.maxStartTime}}
          </template>
          <template slot-scope="{ row }" slot="action">
            <Button type="primary" size="small" @click="editData(row)">编辑</Button>
            <Button v-if="row.publishState === true" type="warning" size="small" @click="publish(row)" style="margin-left: 5px">下架</Button>
            <Button v-else size="small" type="success" @click="publish(row)" style="margin-left: 5px">上架</Button>
          </template>
        </Table>
      </Row>
      <!-- data table end -->
      
      <!-- modal table start -->
      <Modal :title="modalTitle" v-model="ticketModalVisible" :mask-closable='false' :width="900">
        <Form ref="ticketForm" :model="ticketForm" :label-width="80" :rules="ticketFormValidate">
          <FormItem label="演唱会名称" prop="name">
            <Input v-model="ticketForm.name" placeholder="请输入演唱会名称" />
          </FormItem>
          <FormItem class="form-item">
            <Button @click="addScene" type="success" ghost icon="ios-add" style="margin-left: 8px">增加场次</Button>
          </FormItem>
          <!-- {{ticketForm}} -->
          <div v-for="(tabItem,tabIndex) in ticketForm.ticketSceneList" :key="tabIndex">
            <Divider orientation="left">场次{{tabIndex+1}}</Divider>
            <Card class="card">
              
              <FormItem label="演出时间" prop="startTime" class="form-item">
                <DatePicker type="datetime" placeholder="请选择演出时间" v-model="tabItem.startTime"></DatePicker>
                <!-- <DatePicker type="date" v-model="dateTimeSet.date" :value="dateTimeSet.date" :options="options1" placeholder="选择日期"></DatePicker>
                <TimePicker type="time" v-model="dateTimeSet.time" placeholder="选择时间"></TimePicker> -->
              </FormItem>
              <!-- <FormItem label="演出时间" prop="startTime" class="form-item">
                <DatePicker type="datetime" placeholder="请选择演出时间" v-model="tabItem.startTime"></DatePicker>
              </FormItem> -->
              <FormItem label="场次名称" prop="sceneName">
                <Input type="text" v-model="tabItem.sceneName" clearable placeholder="请输入" style="width: 200px"/>
              </FormItem>
              <FormItem class="form-item">
                <Button type="error" size="small" ghost icon="ios-trash" @click="deteleScene(tabIndex)"
                  style="margin-left: 5px">删除</Button>
              </FormItem>
            </Card>
          </div>
          <FormItem label="演出地址" prop="location" style="width:250px">
            <Cascader v-model="ticketForm.location" :data="areaData" @on-change="handleArea" filterable placeholder="请选择"></Cascader>
          </FormItem>
          <!-- <template slot="locations">
            <Cascader v-model="ticketForm.location" :data="areaData" filterable placeholder="请选择"></Cascader>
          </template> -->

          <FormItem label="详细地址" prop="addrDetail" style="width:500px"> 
            <Row :gutter="24">
              <Col span="18">
                <Input v-model="ticketForm.addrDetail" placeholder="请输入演唱会详细地址" />
              </Col>
              <Col span="5">
                <Button @click="codeAddress()">search</Button>
              </Col>
            </Row>
            <Row :gutter="16">
              <Col span="8">
                <div>经度:{{ticketForm.longitude}}</div>
              </Col>
              <Col span="8">
                <div>纬度:{{ticketForm.latitude}}</div>
              </Col>
            </Row>
          </FormItem>
          <div id="container" style="width:800px;height:500px;">
          </div>
          <!-- <div id ="demo">aass</div>
          <div id ="pos-area">
            <button onClick="getCurLocation()">获取精确定位信息</button>
          </div> -->
          <FormItem label="演唱会排序:" prop="sort">
            <InputNumber :min="0" :step="0.01" :precision="2" :active-change='false' v-model="ticketForm.sort" />
          </FormItem>

          <Form-item label="门票图片:" prop="picture">
            <upload-pic-input v-model="ticketForm.picture"></upload-pic-input>
          </Form-item>
          <FormItem label="购买须知" prop="purchaseHtml">
            <editor ref="editor" :value="ticketForm.purchaseHtml" @on-change="handleChange1" style="width:550" />
          </FormItem>
          <FormItem label="门票详情" prop="detailHtml">
            <editor ref="editor" :value="ticketForm.detailHtml" @on-change="handleChange2" style="width:550" />
          </FormItem>

          <div>
            <Divider orientation="left">门票档次</Divider>
            <FormItem class="form-item">
              <Button @click="addTicketGrade" type="success" ghost icon="ios-add" style="margin-left: 8px">增加档次</Button>
            </FormItem>

            <!-- 门票档次 数据start -->
            <Row>
              <Table border ref="defaultColumns" :columns="defaultColumns" :data="ticketForm.ticketGradeList" >
                <template slot-scope="{index,row }" slot="gradeName">
                  <Input :disabled="ticketForm.isQuery" type="text" clearable placeholder="请输入" v-model="row.gradeName"
                  @on-change="updateTableInputVal(index,row,'gradeName')" />
                </template>
                <template slot-scope="{index,row }" slot="sellPrice">
                  <InputNumber :disabled="ticketForm.isQuery" :min="0" :step="1" :precision="2" type="text" clearable placeholder="请输入" v-model="row.sellPrice"
                  @on-change="updateTableInputVal(index,row,'sellPrice')" />
                </template>
                <template slot-scope="{index,row }" slot="rowSum">
                  <!-- <div v-for="(tabItem,tabIndex) in ticketForm.ticketSceneList" :key="tabIndex"> -->
                  <InputNumber :disabled="ticketForm.isQuery" :min="0" :step="1" :precision="0" type="text" clearable placeholder="请输入" v-model="row.rowSum"
                  @on-change="updateTableInputVal(index,row,'rowSum')" />
                </template>
                <template slot-scope="{ index , row }" slot="action2">
                  <Button type="primary" size="small" @click="deteleRow(index,row)">删除</Button>
                </template>

              </Table>
            </Row>
          </div>
            <!-- 门票档次 数据 end -->

          <!-- 库存价格管理 start-->
          <div>
            <Divider orientation="left">库存价格管理</Divider>
            <Row>
              <div v-for="(stockItem,stockIndex) in ticketForm.ticketGradeList" :key="stockIndex">
                <Table border ref="stockSaleColumns" :columns="stockSaleColumns" :data="stockItem.ticketSeatList" >
                  <template slot-scope="{index,row }" slot="gradeName">
                    {{row.gradeName}}
                    <!-- <Input :disabled=true type="text" v-model="row.gradeName" clearable placeholder="请输入" style="width: 200px"/> -->
                  </template>
                  <template slot-scope="{index,row }" slot="seatRow">
                    {{row.seatRow}}<span>排</span>
                    <!-- <Input type="text" v-model="row.seatRow" clearable placeholder="请输入" style="width: 200px"/> -->
                  </template>
                  <template slot-scope="{index,row }" slot="seatSum">
                    <InputNumber :min="0" :step="1" :precision="0" v-model="row.seatSum" 
                    @on-change="updateStockInputVal(index,row,stockIndex,'seatSum')"/>
                  </template>
                  <template slot-scope="{index,row }" slot="seatRange">
                    {{row.minRange}}~{{row.maxRange}}
                    <!-- <Input type="text" v-model="row.gradeName" clearable placeholder="请输入" style="width: 200px"/> -->
                  </template>
                </Table>
              </div>
              <!-- <Table border ref="stockSaleColumns" :columns="stockSaleColumns" :data="ticketForm.ticketGradeList" >
                <template slot-scope="{index,row }" slot="gradeName">
                  <Row v-for="(tabItem,tabIndex) in row.ticketSeatList" :key="tabIndex">
                    <Input type="text" v-model="tabItem.gradeName" clearable placeholder="请输入" style="width: 200px"/>
                  </Row>
                </template>
              </Table> -->
            </Row>
          </div>  

          <!-- {{ticketForm.ticketGradeList}} -->

          <!-- 库存价格管理 stockSaleColumns end-->
          
        </Form>
        <div slot="footer">
          <Button type="text" @click="cancelSubmit()">取消</Button>
          <Button type="primary" :loading="submitLoading" @click="submitInfo">提交</Button>
       </div>

      </Modal>
      <!-- modal table end -->
      
      <!-- page info start -->
      <Row type="flex" justify="end" style="margin-top: 2vh">
        <Page :current="searchForm.pageNo" :page-size="searchForm.pageSize" :total=total show-elevator show-sizer show-total @on-change="changePage" @on-page-size-change="changeSize" />
      </Row>
      <!-- page info end -->
    </Card>
  </div>
</template>

<script>
import {searchTicketList,saveTicket,getTicket,publishState} from "@/api/index";
import uploadPicInput from "@/components/upload-pic-input";
import axios from 'axios';
import Editor from "@/components/editor";
export default {
  name: "TicketsManage",
  components: {
    uploadPicInput,
    Editor
  },
    data() {
        return {
          searchForm: {
              publishState: "",
              pageNo: 1,
              pageSize: 10,
              startDate: "",
              endDate: "",
              ticketName: ""
          },
          columns: [
              { key: "ticketId", type: "selection", width: 60, fixed: "left" },
              {
                  title: "门票名称",
                  key: "name",
                  align: "center",
                  minWidth: 100,
                  sortable: true
              },
              { title: "销量", key: "salesVolume", align: "center", minWidth: 100 },
              { title: "价格", key: "minSellPrice", align: "center", minWidth: 100 },
              { title: "状态", slot: "publishState", align: "center", minWidth: 80 },
              { title: "时间", slot: "publishTime", align: "center", minWidth: 80 },
              {
                  title: "操作",
                  slot: "action",
                  align: "center",
                  width: 200,
                  fixed: "right"
              }
          ],
          tableData: [],
          loading: true,
          total: 0,
          selectList: [],
          selectCount: 0,
          tableData: [],
          ticketModalVisible: false,
          ticketForm: {
            name: "",
            ticketId: "",
            ticketSceneList: [],
            location: [],
            sort: 0,
            picture: "",
            purchaseHtml: "",
            detailHtml: "",
            addrDetail: "",
            addrId: "",
            latitude: "",
            longitude: "",
            provinceId: "",
            ticketGradeList: [{ticketSeatList:[]}],
            addrName: []
          },
          
          ticketFormValidate: {
            name: [{ required: true, message: "门票名称不能为空", trigger: "blur" }]
          },
          dateTimeSet:{
            date: "",
            time: ""
          },
          options1: {
              disabledDate (date) {
                return date && date.valueOf() < Date.now() - 86400000;
              }
          },
          submitLoading: false,
          modalTitle: "",
          modalVisible: false,
          areaData: [],
          geocoder: "",
          citylocation: "",
          originGradeData: [],
          defaultColumns: [
            {
              type: "selection",
              key: 'gradeId',
              width: 60, 
              fixed: "left"
            },
            {
              title: '档次名称',
              slot: 'gradeName',
              align: 'center',
              minWidth: 100
            },
            {
              title: '销售价（元）',
              slot: 'sellPrice',
              align: 'center',
              minWidth: 100
            },
            {
              title: '档次排数',
              slot: 'rowSum',
              align: 'center',
              minWidth: 100
            },
            {
              title: "操作",
              slot: "action2",
              align: "center",
              width: 200,
              fixed: "right"
            }
          ],
          stockSaleColumns: [
            {
              title: '档次名称',
              slot: 'gradeName',
              align: 'center',
              minWidth: 100
            },
            {
              title: '座位区',
              slot: 'seatRow',
              align: 'center',
              minWidth: 100
            },
            {
              title: '座位数量',
              slot: 'seatSum',
              align: 'center',
              minWidth: 100
            },
            {
              title: '对应座位号范围',
              slot: 'seatRange',
              align: 'center',
              minWidth: 100
            }
          ],
        };
    },
    methods: {
      init() {
        const self = this;
        var marker,longitudes,latitudes = null;
        //定义map变量 调用 qq.maps.Map() 构造函数   获取地图显示容器
        var map = new qq.maps.Map(document.getElementById("container"), {
            center: new qq.maps.LatLng(39.916527,116.397128),      // 地图的中心地理坐标。
            zoom:16                                                 // 地图的中心地理坐标。
        });
        //调用地址解析类
        self.geocoder = new qq.maps.Geocoder({
            complete : function(result){
                map.setCenter(result.detail.location);
                var marker = new qq.maps.Marker({
                    map:map,
                    draggable: false,
                    position: result.detail.location
                });
                // console.log('所在位置: ' + result.detail.location);
                //经度
                self.ticketForm.longitude = result.detail.location.lat;
                //纬度
                self.ticketForm.latitude = result.detail.location.lng;
            }
        });
        //调用城市服务信息
        self.citylocation = new qq.maps.CityService({
            complete : function(results){
              // console.log(results);
              // console.log(results.detail.detail);
              // console.log(results.detail.latLng);
                map.setCenter(results.detail.latLng);
                // city.style.display = 'inline';
                // city.innerHTML = '所在位置: ' + results.detail.name;
          
                if (marker != null) {
                    marker.setMap(null);
                }
                //设置marker标记
                marker = new qq.maps.Marker({
                    map: map,
                    draggable: false,
                    position: results.detail.latLng
                });
                //获取地址信息
            }
        });
        //绑定单击事件添加参数
        qq.maps.event.addListener(map, 'click', function(event) {
          //经度
          longitudes = event.latLng.getLat();
          //纬度
          latitudes = event.latLng.getLng();
          // console.log(longitudes);
          // console.log(latitudes);
          // console.log(event);
          //设置经纬度信息
          var latLng = new qq.maps.LatLng(longitudes, latitudes);
          // console.log(latLng);
          //调用城市经纬度查询接口实现经纬查询
          self.citylocation.searchCityByLatLng(latLng);
            alert('您点击的位置为: [' + event.latLng.getLat() + ', ' +
            event.latLng.getLng() + ']');
        });
      },
      codeAddress() {
        const self = this;
        var address = self.ticketForm.addrDetail;
        //通过getLocation();方法获取位置信息值
        self.geocoder.getLocation(address);
         //设置服务请求成功的回调函数
        // this.geocoder.setComplete(function(result) {
        // console.log(result);
        // });
         //若服务请求失败，则运行以下函数
        // this.geocoder.setError(function() {
        //     alert("出错了，请输入正确的地址！！！");
        // });
      },
      // initMap(){
      //   var citylocation,map,marker = null;
      //   var center = new qq.maps.LatLng(39.916527,116.397128);
      //   // var city = document.getElementById("city");
      //   map = new qq.maps.Map(document.getElementById('container'),{
      //       center: center,
      //       zoom: 17
      //   });
      //   //调用城市服务信息
      //   citylocation = new qq.maps.CityService({
      //       complete : function(results){
      //           map.setCenter(results.detail.latLng);
      //           // city.style.display = 'inline';
      //           // city.innerHTML = '所在位置: ' + results.detail.name;
          
      //           if (marker != null) {
      //               marker.setMap(null);
      //           }
      //           //设置marker标记
      //           marker = new qq.maps.Marker({
      //               map: map,
      //               position: results.detail.latLng
      //           });
      //       }
      //   });
      //   //调用地址解析类
      //   self.geocoder = new qq.maps.Geocoder({
      //       complete : function(result){
      //           map.setCenter(result.detail.location);
      //           var marker = new qq.maps.Marker({
      //               map:map,
      //               position: result.detail.location
      //           });
      //           console.log('所在位置: ' + result.detail.location);
      //           //经度
      //           self.ticketForm.longitude = result.detail.location.lat;
      //           //纬度
      //           self.ticketForm.latitude = result.detail.location.lng;
      //       }
      //   });
      // },
      geolocation_latlng() {
          const self = this;
          var lat = parseFloat(self.ticketForm.longitude);
          var lng = parseFloat(self.ticketForm.latitude);
          //设置经纬度信息
          var latLng = new qq.maps.LatLng(lat, lng);
          // console.log(latLng);
          //调用城市经纬度查询接口实现经纬查询
          self.citylocation.searchCityByLatLng(latLng);
      },
      getAreaInfo() {
				axios.get('../static/data/areas.json').then(res => {
					let areaData = res.data
					this.convertArea(areaData)
					this.areaData = areaData;
				})
      },
      convertArea(area) {
				area.forEach(item => {
					if (item.children) {
						this.convertArea(item.children);
					}
					item.value = item.id
				});
      },
      handleArea (value, selectedData){
        this.ticketForm.addrDetail = selectedData.map(o => o.label).join(', ');
      },
      initFormatter () {
        Date.prototype.Format = function (fmt) { //
          let o = {
            "M+": this.getMonth() + 1,                 //月份  
            "d+": this.getDate(),                    //日  
            "h+": this.getHours(),                   //小时  
            "m+": this.getMinutes(),                 //分  
            "s+": this.getSeconds(),                 //秒  
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度  
            "S": this.getMilliseconds()             //毫秒  
          };
          if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
          for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
              fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
          return fmt;
        }
      },
      handleChange1(html, text) {
        this.ticketForm.purchaseHtml = html;
      },
      handleChange2(html, text) {
        this.ticketForm.detailHtml = html;
      },
      selectDate(selectDate, dateType) {
        this.searchForm.startDate = selectDate[0];
        this.searchForm.endDate = selectDate[1];
      },
      addScene() {
        const self = this;
        self.ticketForm.ticketSceneList.push({
          sceneName: "",
          startTime: ""
        });
      },
      deteleScene (index){
        const self = this;
        let num = index+1;
        self.$Modal.confirm({
          title: "提示",
          content: "请确认是否要删除该场次:" + num,
          onOk: () => {
            self.ticketForm.ticketSceneList.splice(index,1);
            self.$Message.success("删除成功");
          }
        });
      },
      getDataList() {
            this.loading = true;
            let params = this.searchForm;
            searchTicketList(params).then(res => {
                this.loading = false;
                if (res.resultCode == "SUCCESS"){
                    this.tableData = res.data.list;
                    this.total = res.data.total;
                } else {
                    this.$Message.error({
                        content: '操作失败：' + res.message,
                        duration: 5
                    });
                }
            });
        },
      handleSearch() {
          this.getDataList();
      },
      handleReset() {
          this.$refs.searchForm.resetFields();
          this.searchForm.pageNo = 1;
          this.searchForm.pageSize = 10;
          this.getDataList();
      },
      changePage(pageNo) {
            this.searchForm.pageNo = pageNo;
            this.getDataList();
        },
      changeSize(size) {
          this.searchForm.pageSize = size;
          this.getDataList();
      },
      saveSelect(e) {
          this.selectList = e;
          this.selectCount = e.length;
      },
      cancelSubmit() {
        this.ticketModalVisible = false;
        this.submitLoading = false;
      },
      addData() {
        //调用初始化函数地图
        this.init();
        this.modalType = 0;
        this.modalTitle = "添加门票";
        this.$refs.ticketForm.resetFields();
        this.ticketForm.ticketId = "";
        this.ticketModalVisible = true;
        this.ticketForm.location = [];
        this.ticketForm.ticketSceneList = [];
        this.ticketForm.ticketGradeList = []
        this.ticketForm.addrName = [];
        this.ticketForm.longitude = "";
        this.ticketForm.latitude = "";
      },
      editData(row){
        //调用初始化函数地图
        this.init();
        this.modalTitle = "编辑门票信息",
        this.$refs.ticketForm.resetFields();
        this.ticketForm.location = [];
        this.ticketForm.ticketSceneList = [];
        this.ticketForm.ticketGradeList = []
        this.ticketForm.addrName = [];
        this.ticketModalVisible = true;
        getTicket(row.ticketId).then(res => {
          if (res.resultCode == 'SUCCESS') {
          this.ticketForm.ticketSceneList = res.data.ticketSceneInfoList;
          this.ticketForm.ticketId = res.data.ticketId;
          this.ticketForm.addrId = res.data.addrId;
          this.ticketForm.location = res.data.addrIds.split(",");
          this.ticketForm.addrName = res.data.addrName.split(",");
          this.ticketForm.addrDetail = res.data.addrDetail;
          this.ticketForm.detailHtml = res.data.detailHtml;
          this.ticketForm.latitude = res.data.latitude;
          this.ticketForm.longitude = res.data.longitude;
          this.ticketForm.name = res.data.name;
          this.ticketForm.picture = res.data.picture;
          this.ticketForm.purchaseHtml = res.data.purchaseHtml;
          this.ticketForm.sort = res.data.sort;
          this.ticketForm.ticketGradeList = res.data.ticketGradeInfoList;
          // this.originGradeData = res.data.ticketGradeInfoList.slice(0);
          // console.log("获取原始数据");
          // console.log(this.originGradeData);
          this.geolocation_latlng();
          }
        });
      },
      submitInfo() {
        this.$refs.ticketForm.validate(valid =>{
          if(valid){
            const self = this;
            if (self.ticketForm.ticketSceneList.length == 0){
              self.$Message.warning("最少需要添加一个场次!!!");
              return;
            }
            let param = this.ticketForm;
            self.setParam(param);
            delete self.ticketForm.location;
            // console.log(param);
            this.submitLoading = true;
            saveTicket(param).then(res => {
              this.ticketForm.location = [];
              if (res.resultCode == 'SUCCESS'){
                self.$refs.ticketForm.resetFields();
                self.submitLoading = false;
                self.$Message.success("保存成功");
                self.ticketModalVisible = false;
                this.getDataList();
              } else {
                self.$Message.error({
                  content: '保存失败：' + res.message,
                  duration: 5
                });
                this.submitLoading = false;
              }
            });
          } else {
            this.$Message.error({
              content: "校验不通过，请按提示规则输入数据",
              duration: 5
            });
          }
        });
      },
      setParam (param){
        const self = this;
        let ticketScenes = [];
        self.ticketForm.ticketSceneList.forEach(scene => {
          if (typeof scene.startTime == "Date" || typeof scene.startTime == "object")
            scene.startTime = scene.startTime.Format('yyyy-MM-dd hh:mm:ss');
            let scenes = {
              startTime: scene.startTime,
              sceneName: scene.sceneName
            };
            ticketScenes.push(scenes);
        });
        param.ticketSceneList = ticketScenes;
        let areaIds = self.ticketForm.location;
        param.addrId = areaIds.length && areaIds[areaIds.length - 1];
        param.provinceId = areaIds.length && areaIds[0];
      },
      publish(row) {
        let option = row.publishState ? '下架' : '上架';
        this.$Modal.confirm({
          title: "提示",
          content: "请确认是否要" + option + '演唱会: <strong> ' + row.name + '</strong> ?',
          onOk: () => {
            let params = {};
            let ids = [];
            ids.push(row.ticketId);
            params.ids = ids;
            params.enabled = !row.publishState;
            publishState(params).then(res => {
              if(res.resultCode == 'SUCCESS'){
                this.$Message.success(option + "成功");
                this.getDataList();
              }else{
                this.$Message.error({
                  content: '操作失败：' + res.message,
                  duration: 5
                });
              }
            });
          }
        });
      },
      initColumns (){

      },
      addTicketGrade () {
        this.ticketForm.ticketGradeList.push({
          gradeId: this.ticketForm.ticketGradeList.gradeId || 0,
          gradeName: this.ticketForm.ticketGradeList.gradeName || "",
          rowSum: this.ticketForm.ticketGradeList.rowSum || 0,
          sellPrice: this.ticketForm.ticketGradeList.sellPrice || 0.00,
          ticketSeatList: this.ticketForm.ticketGradeList.ticketSeatList || [],
        })
      },
      updateTableInputVal (index, row, attrName){
        let tabelData = this.ticketForm.ticketGradeList;
        let originGradeData = JSON.parse(JSON.stringify(tabelData));
        tabelData[index][attrName] = row[attrName];
        if (row.gradeId !=0 && (attrName == "rowSum" || attrName == "gradeName")){
          // console.log(row);
          let minRan = 0;
          let maxRan = 0;
          // console.log(originGradeData);
          // console.log(tabelData);

          if(attrName == "rowSum"){
              let ticketSeatList = tabelData[index]["ticketSeatList"];
              let originRowSum = originGradeData[index].rowSum;
              // let seatRow = originGradeData[index].ticketSeatList[originGradeData[index].ticketSeatList.length-1].seatRow;
              if( row.rowSum > originRowSum ){
                for(let indexof = 1; indexof <= row.rowSum - originRowSum ; indexof++){
                  tabelData[index]["ticketSeatList"].push({
                    gradeName: tabelData[index]["gradeName"],
                    seatRow: 0,
                    seatSum: 0,
                    seatId: 0,
                    minRange: 0,
                    maxRange: 0
                  });
                }
                // console.log("tabelData");
                // console.log(tabelData);
              }
              if(row.rowSum < originRowSum){
                for(let indexof = 1; indexof <= originRowSum - row.rowSum  ; indexof++){
                  tabelData[index]["ticketSeatList"].splice(--originRowSum,1)
                }
                for(let i = originRowSum ; i >= 0 ; i--){

                }
              }
          }
          if(attrName == "gradeName"){
            for(let indexof = 1; indexof <= row.rowSum; indexof++){
              let ticketSeatList = tabelData[index]["ticketSeatList"];
              ticketSeatList[indexof-1].gradeName = row.gradeName;
            }
          }
        }
        else if (row.gradeId == 0 && (attrName == "rowSum" || attrName == "gradeName")) {
          tabelData[index]["ticketSeatList"] = [];
          // console.log(row);
          let minRan = 0;
          let maxRan = 0;
          //刷新库存价格表
          for(let indexof = 1; indexof <= row.rowSum; indexof++){
            tabelData[index]["ticketSeatList"].push({
              gradeName: tabelData[index]["gradeName"],
              seatRow: 0,
              seatSum: 1,
              seatId: 0,
              minRange: 0,
              maxRange: 0
            });
            let ticketSeatList = tabelData[index]["ticketSeatList"];
            if(indexof == 1){
              minRan = 1;
              maxRan =ticketSeatList[indexof-1].seatSum;
            }else{
              minRan = 1+maxRan;
              maxRan = ticketSeatList[indexof-1].seatSum + maxRan;
            }
            // console.log(maxRan);
            ticketSeatList[indexof-1].minRange = minRan;
            ticketSeatList[indexof-1].maxRange = maxRan;
          }
        }
        //更新座位区
        let temp = 0;//计数器
        for(let i = 0 ; i < tabelData.length; i++){
          let ticketSeatData = tabelData[i]["ticketSeatList"];
          for( let j = 1 ; j <= tabelData[i].rowSum ; j++){
            temp ++;
            ticketSeatData[j-1].seatRow = temp;
          }
        }
      },
      updateStockInputVal(index, row, stockIndex,attrName){
        const self = this;
        let tabelDatas = self.ticketForm.ticketGradeList[stockIndex].ticketSeatList;
        // console.log(tabelDatas);
        tabelDatas[index][attrName] = row[attrName];
        if(attrName == "seatSum"){
          // console.log(tabelDatas.length);
          // let minRan = 0;
          // let maxRan = 0;
          for(let i = 1 ; i<= tabelDatas.length; i++){
          //   if(i ==1 ){
          //     minRan = 1;
          //     maxRan =tabelDatas[i-1].seatSum;
          //   }else{
          //     minRan = 1+maxRan;
          //     maxRan = maxRan + tabelDatas[i-1].seatSum;
          //   }
          //   tabelDatas[i-1]["minRange"] = minRan;
          //   tabelDatas[i-1]["maxRange"] = maxRan;
            tabelDatas[i-1]["minRange"] = 1;
            tabelDatas[i-1]["maxRange"] = tabelDatas[i-1].seatSum;
          }
        }
      },
      deteleRow(index,row) {
        // console.log(row);
        const self = this;
        let num = index+1;
        if(row.gradeId != 0 && row.rowSum != 0){
          self.$Message.error({
            title: "提示",
            content: "请从该档次: 【"+row.gradeName+"】  排数数值最大的排数进行删除",
            duration: 5
          });
        }
        else{
          self.$Modal.confirm({
            title: "提示",
            content: "请确认是否要删除第" + num + "个档次？" ,
            onOk: () => {
              self.ticketForm.ticketGradeList.splice(index,1);
              self.$Message.success("删除成功");
            }
          });
        }
      }
    },
  mounted() {
      this.getDataList();
      this.initFormatter();
      this.getAreaInfo();
  }
}
</script>