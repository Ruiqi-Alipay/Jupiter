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
                  <div className="col-sm-4 col-sm-offset-2">
                    <button type="button" className="btn btn-sm btn-primary" ng-click="downloadEnv('win-env')">下载工程（Windows）</button>
                  </div>
                  <div className="col-sm-4">
                    <button type="button" className="btn btn-sm btn-primary" ng-click="downloadEnv('mac-env')">下载工程（Mac）</button>
                  </div>
                </div>

                <div className="page-header">
                  <h3>执行测试<small>Windows</small></h3>
                </div>
                <div className="row step">
                  <div className="col-md-1 col-sm-1">
                    <span className="label label-success">Step 1</span>
                  </div>
                  <div className="col-md-8 col-sm-8">
                    <p>链接手机，打开手机USB调试，确保手机驱动程序已安装</p>
                  </div>
                </div>
                <div className="row step">
                  <div className="col-md-1 col-sm-1">
                    <span className="label label-success">Step 2</span>
                  </div>
                  <div className="col-md-8 col-sm-8">
                    <p>双击run.bat开始执行测试</p>
                  </div>
                </div>

                <div className="page-header">
                  <h3>查看报告<small>性能与脚本执行报告</small></h3>
                </div>
                <div className="row step">
                  <div className="col-md-1 col-sm-1">
                    <span className="label label-success">性能报告</span>
                  </div>
                  <div className="col-md-8 col-sm-8">
                    <p>测试执行结束后，会在工程跟目录下生成proference_currentdate.report文件，在‘性能报告’选项卡中导入该文件即可查看</p>
                  </div>
                </div>
                <div className="row step">
                  <div className="col-md-1 col-sm-1">
                    <span className="label label-success">执行报告</span>
                  </div>
                  <div className="col-md-8 col-sm-8">
                    <p>测试执行结束后，会在工程跟目录下生成test_report文件夹，双击文件夹中index.html即可</p>
                  </div>
                </div>

                <div className="page-header">
                  <h3>脚本编辑<small>测试脚本制作</small></h3>
                </div>
                <div className="row step">
                  <div className="col-md-1 col-sm-1">
                    <span className="label label-success">Step 1</span>
                  </div>
                  <div className="col-md-8 col-sm-8">
                    <p>配置脚本初始化行为：该部分行为仅在脚本第一次执行时执行一次，后续的脚本迭代将跳过该部分动作。（具体动作说明见Step 2）</p>
                  </div>
                </div>
                <div className="row step">
                  <div className="col-md-1 col-sm-1">
                    <span className="label label-success">Step 2</span>
                  </div>
                  <div className="col-md-8 col-sm-8">
                    <p>编写测试动作，测试时将按编号先后顺序执行，每个动作格式如下</p>
                    <p><strong>动作类型：</strong>执行动作类型</p>
                    <p><strong>动作对象：</strong>执行动作目标控件的查找方式</p>
                    <p><strong>动作参数：</strong>该动作相关参数，如动作类型为'输入'时，该值为要输入的内容</p>
                    <p>其中，动作对象的查找方式支持'按内容查找'和'按类型和位置查找'两种模式</p>
                    <p><strong>按内容查找：</strong>按控件的显示内容查找，如要查找下图中按钮，可'动作对象'中输入'Pay Now'</p>
                    <img src="res/element_search_content.png"/>
                    <p><strong>按类型和位置查找：</strong>目前仅支持编辑框，相同类型控件的位置排序规则为自上而下，从左到右</p>
                    <img src="res/element_search_image.png"/>
                  </div>
                </div>
                <div className="row step">
                  <div className="col-md-1 col-sm-1">
                    <span className="label label-success">Step 3</span>
                  </div>
                  <div className="col-md-8 col-sm-8">
                    <p>配置判断脚本执行是否成功的评判标准，当有多个时，需全部成功</p>
                    <p><strong>判定类型：</strong>支持 单元/界面 两种， 单元比对控件显示内容是否一致； 界面比对当前截图与指定图片的像素相似度</p>
                    <p><strong>判定对象：</strong>类型为单元时，该值为控件内显示类容； 类型为界面时，该值为对比图片的名称（存放于verify_images目录下）</p>
                    <p><strong>判定参数：</strong>仅用于界面判定时，指定成功判定的像素相似度阀值</p>
                    <img src="res/script_create_step_3.png"/>
                  </div>
                </div>
                <div className="row step">
                  <div className="col-md-1 col-sm-1">
                    <span className="label label-success">Step 4</span>
                  </div>
                  <div className="col-md-8 col-sm-8">
                    <p>配置要返回起始页时可能需要执行的动作，程序会在每个页面依次尝试下述动作（按顺序），直到回到起始页（Step 5判定为成功）</p>
                    <p>动作规则格式见 Step 2</p>
                  </div>
                </div>

                <div className="row step">
                  <div className="col-md-1 col-sm-1">
                    <span className="label label-success">Step 5</span>
                  </div>
                  <div className="col-md-8 col-sm-8">
                    <p>配置Step 4执行是否回到了起始页的评判标准</p>
                    <p>判定规则格式见 Step 3</p>
                  </div>
                </div>
                <div className="row step">
                  <div className="col-md-1 col-sm-1">
                    <span className="label label-warning">参数配置</span>
                  </div>
                  <div className="col-md-8 col-sm-8">
                    <p>配置脚本中用到的参数数据，顺序无关</p>
                    <img src="res/config_parameters.png"/>
                  </div>
                </div>
              </div>
            </div>
        );
    }
});


