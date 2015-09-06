var React = require('react');

module.exports = React.createClass({
    render: function () {
        return (
            <div className='row'>
              <div className="col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2" style={{paddingBottom: '200px'}}>


                <div className="page-header">
                  <h3>运行环境下载<small>Windows/Mac</small></h3>
                </div>
                <div className="row step">
                  <div className="col-md-1 col-sm-1">
                    <span className="label label-success">安装Git</span>
                  </div>
                  <div className="col-md-8 col-sm-8">
                    <span>如果没有安装Git，请 </span><a href="https://git-scm.com/downloads" target="_blank">下载Git</a><span> 并安装</span>
                  </div>
                </div>
                <div className="row step">
                  <div className="col-md-1 col-sm-1">
                    <span className="label label-success">执行</span>
                  </div>
                  <div className="col-md-8 col-sm-8">
                    <p>git clone http://gitlab.alibaba-inc.com/test-automation/AutomationEnv.git</p>
                  </div>
                </div>


                <div className="page-header">
                  <h3>执行测试<small>Windows/Mac</small></h3>
                </div>
                <h6>Git clone执行结束后进入AuthmationEnv文件夹即可看到下述文件结构</h6>
                <img src="res/guide_img_1.png" style={{width: '100%'}}/>
                <div className="row step">
                  <div className="col-md-1 col-sm-1">
                    <span className="label label-success">Windows</span>
                  </div>
                  <div className="col-md-8 col-sm-8">
                    <p>双击run.bat</p>
                  </div>
                </div>
                <div className="row step">
                  <div className="col-md-1 col-sm-1">
                    <span className="label label-success">Mac OS X</span>
                  </div>
                  <div className="col-md-8 col-sm-8">
                    <p>双击run.command</p>
                  </div>
                </div>


                <div className="page-header">
                  <h3>脚本编辑<small>测试脚本制作</small></h3>
                </div>

                <div className="row step">
                  <div className="col-sm-2">
                    <span className="label label-success">脚本基本信息编辑</span>
                  </div>
                  <div className="col-sm-10">
                    <p><b>Script Type: </b>脚本类型，脚本分执行脚本和配置脚本2中，其中配置脚本用于在每个执行脚本执行前执行，一般可抽象一些脚本共同的操作到配置脚本</p>
                    <p><b>Name: </b>脚本标题，该名称会用于执行脚本时的脚本显示，对于不同脚本最好不要重复标题</p>
                    <img src="res/guide_img_2.png" style={{width: '90%'}}/>
                  </div>
                </div>

                <div className="row step">
                  <div className="col-sm-2">
                    <span className="label label-success">订单创建编辑</span>
                  </div>
                  <div className="col-sm-10">
                    <h6><span className="label label-warning">该部分内容仅针对收银台订单创建，订单无关测试可忽略改部分内容</span></h6>
                    <p><b>Order ID: </b>订单创建成功后将使用这里配置的值为KEY将订单号配置在脚本参数中，即如在这里填写 tradeNo，然后在执行脚本的行为参数中填写tradeNo，执行时tradeNo将被替换为实际的订单号</p>
                    <p><b>Buyer ID: </b>用于创建订单的买家ID，必填</p>
                    <p><b>Order Amount: </b>订单金额，默认为随机</p>
                    <p><b>Coupon Amount: </b>订单红包金额，默认为随机</p>
                    <p><b>Combine Times: </b>创建笔数，默认为1</p>
                    <img src="res/guide_img_3.png" style={{width: '90%'}}/>
                  </div>
                </div>

                <div className="row step">
                  <div className="col-sm-2">
                    <span className="label label-success">脚本参数配置</span>
                  </div>
                  <div className="col-sm-10">
                    <p>若脚本行为中需要输入多次相同的参数，为避免输入多次，可以将值配置为脚本参数，然后将参数KEY值写入到脚本行为中，方便修改</p>
                    <h6><span className="label label-warning">注意：脚本参数的优先级高于全局参数，即如果脚本参数和全局参数定义了相同KEY值的参数，全局参数将被覆盖</span></h6>
                    <img src="res/guide_img_4.png" style={{width: '90%'}}/>
                  </div>
                </div>

                <div className="row step">
                  <div className="col-sm-2">
                    <span className="label label-success">脚本行为配置</span>
                  </div>
                  <div className="col-sm-10">
                    <p>脚本行为配置，脚本执行时，将按照编号逐个执行，全部执行成功时，视为脚本执行成功，期间任意行为执行失败时会中断剩余步骤的执行并视为执行失败</p>
                    <img src="res/guide_img_5.png" style={{width: '90%'}}/>
                  </div>
                </div>

              </div>
            </div>
        );
    }
});


