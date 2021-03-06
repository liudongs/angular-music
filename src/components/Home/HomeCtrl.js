/**
 * Created by 郑树聪 on 2016/4/15.
 */
var $config = require('../Common/config');

var musicApp = $config.musicApp;

musicApp.controller('HomeCtrl', ['$scope', '$state', 'PageTableData', 'SingerService',
    'AlbumService', 'PlaylistService',
    function($scope, $state, PageTableData, SingerService, AlbumService, PlaylistService){

        var PAGE_SIZE = 30;

        $scope.playlists = [];
        $scope.singers = [];
        // 分页获取所有歌单
        $scope.getPlaylists = function(nextPage, pageSize) {

            PageTableData.pagination.itemsPerPage = PAGE_SIZE;
            var params = {
                currPage: nextPage || 1,
                pageSize: pageSize || PAGE_SIZE
            };
            PlaylistService.filterPlayListsByPage(params).success(function(data) {

                if(data.success) {
                    $scope.playlists = data.playlists;
                    PageTableData.pagination.totalItems = data.totalItems;
                    PageTableData.pagination.currPage = data.currPage;
                }
            });
        };
        // 分页获取所有歌手
        $scope.getSingers = function(nextPage, pageSize) {

            PageTableData.pagination.itemsPerPage = PAGE_SIZE;
            var params = {
                currPage: nextPage || 1,
                pageSize: pageSize || PAGE_SIZE
            };
            SingerService.getSingers(params).success(function(data) {

                if(data.success) {
                    $scope.singers = data.singers;
                    PageTableData.pagination.totalItems = data.totalItems;
                    PageTableData.pagination.currPage = data.currPage;
                }
            });
        };
    }
]);
