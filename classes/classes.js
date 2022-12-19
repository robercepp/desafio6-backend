const fs = require ('fs');

module.exports = class Chats {
    constructor(archivo) {
        this.archivo = archivo
    }
    async fileChecker() {
        if(!fs.existsSync(this.archivo)){
            try{
            await fs.promises.writeFile(this.archivo, "[]")
            } catch(error) {
            console.log('error!: ',error)
            }
        }
    }
    async save(object) {
        await this.fileChecker()
        try{
            const datos = await fs.promises.readFile(this.archivo, 'utf-8')
            const data = JSON.parse(datos)
            data.push(object)
            await fs.promises.writeFile(this.archivo, JSON.stringify(data, null, 2))
        } catch(error) {
            console.log('error!: ',error)
        }
    }
    async getAll() {
        await this.fileChecker()
        try{
            const datos = await fs.promises.readFile(this.archivo, 'utf-8')
            const data = JSON.parse(datos)
            return data
        } catch(error) {
            console.log('error!: ',error)
        }
    }
}