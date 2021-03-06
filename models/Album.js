/**
 * 专辑模型
 * Created by 郑树聪 on 2016/3/28.
 */
var config = require('../config/config');
var Db = require('../utils/Db');
//var common = require('../utils/Common');
var db = new Db();

var album_tb = config.tableName.album_tb;
var singer_tb = config.tableName.singer_tb;
var song_tb = config.tableName.song_tb;

var Album = function (albumInfo, pagination, keyword) {
    // 专辑信息
    if(typeof albumInfo !== 'undefined') {
        this.id = albumInfo.id;
        this.album_name = albumInfo.album_name;
        this.album_info = albumInfo.album_info;
        this.publish_date = albumInfo.publish_date;
        this.singer_id = albumInfo.singer_id;
    }
    // 分页信息
    if(typeof pagination !== 'undefined') {
        this.currPage = (pagination.currPage-1) || 0;
        this.pageSize = pagination.pageSize || 10;
    }
    // 搜索所用关键词
    if(typeof keyword !== 'undefined' && keyword !== '') {
        this.keyword = '%' + keyword + '%';
    }
};

// 获取所有专辑id和name
Album.prototype.getAllAlbums = function(callback) {

    var sql = 'select id, album_name, singer_id from ' + album_tb;
    db.query(sql, [], callback);
};

// 分页查找专辑
Album.prototype.findAlbums = function(callback){

    var sql,
        count_sql,
        params;

    if(typeof this.keyword !== 'undefined') {
        sql = 'select a.id, a.album_name, a.album_info, a.publish_date, a.singer_id, s.singer_name,' +
            ' (select so.song_img from ' + song_tb + ' as so where so.id=a.singer_id limit 1) as first_mp3_img from ' +
            album_tb + ' as a left join ' + singer_tb +' as s on a.singer_id=s.id where a.id >= (select id from ' + album_tb +
            ' where album_name like ? order by id limit ?, 1) and a.album_name like ? order by a.create_time desc limit ?;';
        count_sql = 'select count(*) as totalItems from ' + album_tb + ' where album_name like ?';
        params = [this.keyword, this.currPage*this.pageSize, this.keyword, this.pageSize, this.keyword];
    } else {
        sql = 'select a.id, a.album_name, a.album_info, a.publish_date, a.singer_id, s.singer_name,' +
            ' (select so.song_img from ' + song_tb + ' as so where so.id=a.singer_id limit 1) as first_mp3_img from ' +
            album_tb + ' as a left join ' + singer_tb +' as s on a.singer_id=s.id where a.id >= (' +
            'select id from ' + album_tb + ' order by id limit ?, 1) order by a.create_time desc limit ?;';
        count_sql = 'select count(*) as totalItems from ' + album_tb;
        params = [this.currPage*this.pageSize, this.pageSize];
    }
    db.query(sql + count_sql, params, callback);
};

// 根据id查找某张专辑
Album.prototype.findAlbumById = function(callback){

    var sql = 'select id, album_name, album_info, publish_date, singer_id from ' + album_tb + ' where id = ? limit 1';
    var params = [this.id];
    db.query(sql, params, callback);
};

// 根据歌手id查找某位歌手的所有专辑
Album.prototype.findAlbumsBySingerId = function(callback){

    var sql = 'select id, album_name, album_info, publish_date, singer_id from ' + album_tb + ' where singer_id = ?';
    var params = [this.singer_id];
    db.query(sql, params, callback);
};

// 添加一张新专辑并返回最新添加的专辑的id，若插入记录重复则返回的是0
Album.prototype.addAlbum = function(callback) {

    var sql,
        lastest_id_sql,
        params,
        create_time = new Date();

    sql = 'insert ignore into ' + album_tb + '(album_name, album_info, publish_date, create_time, singer_id) values (?, ?, ?, ?, ?);';
    lastest_id_sql = 'select LAST_INSERT_ID()';
    params = [this.album_name, this.album_info, this.publish_date, create_time, this.singer_id];
    db.query(sql+lastest_id_sql, params, callback);
};

// 更新某张专辑的信息
Album.prototype.updateAlbum = function(callback){

    var sql = 'update ignore ' + album_tb + ' set album_name=?, album_info=?, publish_date=?, singer_id=? where id = ?';
    db.query(sql, [this.album_name, this.album_info, this.publish_date, this.singer_id, this.id], callback);
};

// 删除专辑，ids要删除的专辑的id，数组
Album.prototype.deleteAlumsById = function(ids, callback) {

    var sql = 'delete from ' + album_tb + ' where id in (?)';
    db.query(sql, [ids], callback);
};

// 删除某歌手专辑，ids要删除的专辑的歌手id，数组
Album.prototype.deleteAlbumsBySingerId = function(ids, callback) {

    var sql = 'delete from ' + album_tb + ' where singer_id in (?)';
    var params = [ids];
    db.query(sql, params, callback);
};

// 根据专辑名和歌手id查找
Album.prototype.findAlbumIdByFilters = function(callback) {

    var sql = 'select id from ' + album_tb + ' where album_name=? and singer_id=? limit 1';
    db.query(sql, [this.album_name, this.singer_id], callback);
};


module.exports = Album;
