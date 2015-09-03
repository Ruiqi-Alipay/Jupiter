export var appConfigs = {
	defaultAction: '点击',
	actionConfigs: [
		{
			type: '点击',
			param: true
		},
		{
			type: '点击位置',
			targets: ['按钮', '图片']
		},
		{
			type: '输入',
			targets: ['编辑框'],
			param: true
		},
		{
			type: '阿里键盘输入',
			param: true
		},
		{
			type: '阿里密码输入',
			param: true
		},
		{
			type: 'BACK'
		},
		{
			type: '快速选择',
			param: true
		},
		{
			type: '单选位置',
			targets: ['单选框']
		},
		{
			type: '多选位置',
			targets: ['多选框']
		},
		{
			type: '清除',
			targets: ['编辑框']
		},
		{
			type: '向上滚动'
		},
		{
			type: '向下滚动'
		},
		{
			type: '文案校验',
			param: true
		}
	]
};