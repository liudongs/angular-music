/**
 * 左侧菜单栏生成指令
 * Created by 郑树聪 on 2016/3/21.
 */
var $config = require('../Common/config');

var musicApp = $config.musicApp;

// 显示菜单
musicApp.directive('showAdminMenu', function(){

    return {
        restrict:'EA',
        scope: {
            menus: '='
        },
        replace: true,
        templateUrl: 'app/views/Menu/menuTpl.html',
        controller: function($scope, $state){

            // 初始化时默认展开当前链接对应的菜单
            var flag=false;
            for(var i = 0; i < $scope.menus.length; i++){
                for(var j = 0; j < $scope.menus[i].subMenus.length; j++){
                    if($state.is('admin') ||$state.includes($scope.menus[i].subMenus[j].state)) {
                        $scope.menus[i].isMenuOpen = true;
                        flag = true;
                        break;
                    }
                }
                if(flag) {
                    break;
                }
            }

            // 菜单列表展开折叠切换
            $scope.toggleMenuOpen = function(menu) {

                menu.isMenuOpen = !menu.isMenuOpen;
            };
        }
    };
});
