const mysql = require('mysql')

let config = {
    host: 'localhost',
    user: 'pi',
    password: 'wang19981021',
    database: 'setu'
}

module.exports.lsp = async function (interaction) {
    const message = await interaction.deferReply({
        fetchReply: true
    })


    let connection = mysql.createConnection(config);
    let time = Date.now() - 604800000
    let command = "select userName, count(*) as count  from lsp  where time>" + time + " group by userName order by count(*) desc"
    //select userName, count(*)  from lsp  where time>3 group by userName order by count(*) desc;
    //let command = "select * from lsp where time>"+time
    let command2 = "select userName, count(*) as count  from lsp group by userName order by count(*) desc"
    var msg = ""

    connection.query(command2, (error, results, fields) => {
        if (error) {
            console.error(error.message)
        }
        var firstPlace = results[0].userName
        var firstNum = results[0].count
        var secondPlace = results[1].userName
        var secondNum = results[0].count - results[1].count
        msg += "从22年1月15日至今的老色批是" + firstPlace + "，共索取色图" + firstNum + "张，比第二名的 " + secondPlace + " 多" + secondNum + `张`
    })


    connection.query(command, (error, results, fields) => {
        if (error) {
            console.error(error.message)
        }
        if(results[0] == null){
            interaction.editReply(msg)
            return
        }
        var firstPlace = results[0].userName
        var firstNum = results[0].count

        msg += "\n本周老色批是 " + firstPlace + "，共索取色图" + firstNum + "张"
        if(results[1] != null){
            var secondPlace = results[1].userName
            var secondNum = firstNum - results[1].count
            msg += "，比第二名的 " + secondPlace + " 多" + secondNum + `张`
        }
        interaction.editReply(msg)
    })


    connection.end()
}

module.exports.amI = async function (interaction) {
    const message = await interaction.deferReply({
        fetchReply: true
    })



    let connection = mysql.createConnection(config);
    var command = "select userName, count(*) as count from lsp where userName='" + interaction.user.username + "'"
    connection.query(command, (error, results, fields) => {
        if (error) {
            console.error(error.message)
        }
        var num = results[0].count
        if (num == 0) {
            interaction.editReply("你还没有索取过色图")
        }
        var msg = "你一共索取过" + num + "张色图"
        interaction.editReply(msg)
    })
}



module.exports.add_lsp = function (interaction) {
    let connection = mysql.createConnection(config);
    let command = `INSERT INTO lsp(userName, time) VALUES('` + interaction.user.username + `', ` + Date.now() + `)`
    connection.query(command)
    connection.end()
}