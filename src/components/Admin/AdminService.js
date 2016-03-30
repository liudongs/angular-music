/**
 * 用户管理模块服务
 * Created by 郑树聪 on 2016/3/27.
 */
var $config = require('../Common/config');

var musicApp = $config.musicApp;

// 管理中心相关服务
musicApp.factory('AdminService', ['$http', function($http) {

    return {
        // 获取左侧菜单数据
        getMenu: function(){

            return $http.get($config.api.getMenuByRole, {});
        },
        // 获取省份、城市、地区数据
        getAreas: function(){

            return $http.get($config.api.getAreas, {});
        },
        // 更新用户信息
        updateUserInfo: function(userInfo){

            return $http.post($config.api.updateUserInfo, userInfo);
        },

        // 获取获取所有歌手的id、name
        getAllSingers: function(){

            return $http({
                method: 'GET',
                url: $config.api.getAllSingers
            });
        },
        // 获取歌手列表
        getSingers: function(pagination){

            return $http({
                method: 'GET',
                url: $config.api.getSingers,
                params: {
                    currPage: pagination.currPage,
                    pageSize: pagination.pageSize,
                    keyword: pagination.keyword
                }
            });
        },
        // 根据id获取某位歌手信息
        getSingerById: function(id){

            return $http({
                method: 'GET',
                url: $config.api.getSingerById,
                params: {
                    id: id
                }
            });
        },
        addSinger: function(singer){

            return $http({
                method: 'POST',
                url: $config.api.addSinger,
                data: {
                    singer_name: singer.singer_name,
                    singer_type: singer.singer_type,
                    language: singer.language,
                    singer_info: singer.singer_info
                }
            });
        },
        updateSinger: function(singer) {

            return $http({
                method: 'POST',
                url: $config.api.updateSinger,
                data: {
                    id: singer.id,
                    singer_name: singer.singer_name,
                    singer_type: singer.singer_type,
                    language: singer.language,
                    singer_info: singer.singer_info
                }
            });
        },
        deleteSingers: function(ids){

            return $http({
                method: 'POST',
                url: $config.api.deleteSingers,
                data: {
                    ids: ids
                }
            });
        },

        getAlbums: function(pagination){

            return $http({
                method: 'GET',
                url: $config.api.getAlbums,
                params: {
                    currPage: pagination.currPage,
                    pageSize: pagination.pageSize,
                    keyword: pagination.keyword
                }
            });
        },
        getAlbumById: function(id){

            return $http({
                method: 'GET',
                url: $config.api.getAlbumById,
                params: {
                    id: id
                }
            });
        },
        getAlbumsBySingerId: function(singerId){

            return $http({
                method: 'GET',
                url: $config.api.getAlbumsBySingerId,
                params: {
                    singer_id: singerId
                }
            });
        },
        addAlbum: function(albumInfo){

            return $http({
                method: 'POST',
                url: $config.api.addAlbum,
                data: {
                    album_name: albumInfo.album_name,
                    album_info: albumInfo.album_info,
                    publish_date: albumInfo.publish_date,
                    singer_id: albumInfo.singer_id
                }
            });
        },
        updateAlbum: function(albumInfo){

            return $http({
                method: 'POST',
                url: $config.api.updateAlbum,
                data: {
                    id: albumInfo.id,
                    album_name: albumInfo.album_name,
                    album_info: albumInfo.album_info,
                    publish_date: albumInfo.publish_date,
                    singer_id: albumInfo.singer_id
                }
            });
        },
        /**
         * 根据id删除专辑
         * @param ids {Array} 要删除的项
         */
        deleteAlumsById: function(ids){

            return $http({
                method: 'POST',
                url: $config.api.deleteAlumsById,
                data: {
                    ids: ids
                }
            });
        },
        /**
         * 根据歌手id删除专辑
         * @param singerIds {Array} 要删除专辑的歌手id
         */
        deleteAlbumsBySingerId: function(singerIds){

            return $http({
                method: 'POST',
                url: $config.api.deleteAlbumsBySingerId,
                data: {
                    singerIds: singerIds
                }
            });
        },

        getSongsByPage: function(filters) {

            return $http({
                method: 'GET',
                url: $config.api.getSongsByPage,
                params: {
                    language: filters.language,
                    singer_id: filters.singer_id,
                    album_id: filters.album_id,
                    currPage: filters.currPage,
                    pageSize: filters.pageSize,
                    keyword: filters.keyword
                }
            });
        },
        getSongById: function(id) {

            return $http({
                method: 'GET',
                url: $config.api.getSongById,
                params: {
                    id: id
                }
            });
        },
        uploadSong: function(songInfo) {

            return $http({
                method: 'POST',
                url: $config.api.uploadSong,
                data: {
                    song_name: songInfo.song_name,
                    url: songInfo.url,
                    publish_date: songInfo.publish_date,
                    singer_id: songInfo.singer_id,
                    album_id: songInfo.album_id
                }
            });
        },
        updateSong: function(ids) {

            return $http({
                method: 'POST',
                url: $config.api.updateSong,
                data: {
                    id: songInfo.id,
                    song_name: songInfo.song_name,
                    url: songInfo.url,
                    publish_date: songInfo.publish_date,
                    singer_id: songInfo.singer_id,
                    album_id: songInfo.album_id
                }
            });
        },
        deleteSongsByIds: function(songInfo) {

            return $http({
                method: 'POST',
                url: $config.api.deleteSongsByIds,
                data: {
                    ids: ids
                }
            });
        }
    };
}]);

/**
 * 分页表格（全选功能）数据共享服务
 * @param pagination {Object} 分页器参数
 * @param itemIds {Array} 当前页的选项id
 * @param selectItemIds {Array} 选中的项id
 */
musicApp.factory('PageTableData', function(){

    return {
        pagination: {
            currPage: 1,
            itemsPerPage: 10,
            maxSize: 3,
            totalItems: 0
        },
        itemIds: [],
        selectItemIds: []
    };
});
