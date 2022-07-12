export default {
    computed: {
        type() {
            return this.item.type;
        },
        file_name() {
            return this.item.file_name;
        },
        isCollection() {
            return this.item.isCollection;
        },
        cover_url() {
            return `${this.item.DOMAIN}/${this.item.cover_url}`;
        },
        isDoc() {
            return this.type.includes('msword') && this.file_name.includes('doc')
        },
        isExe() {
            return this.file_name.includes('exe') && this.type.includes('octet-stream')
        },
        isZip() {
            return this.type.includes('zip') || this.type.includes('x-zip-compressed')
        }
    }
}