import { uploadFiles, merge } from '../../api/file'
import { getMD5 } from "../../utils/cryto";
import { mapActions } from 'vuex'
let uploadFileMixin = {
    data() {
        return {
            chunkSize: 1024 * 1024,
            taskLength: 0,
            loaded: 0,
        }
    },
    methods: {
        // 检查剩余空间
        checkedAbleUpload() {
            let { drive_used, drive_size } = this.userInfo;
            if (drive_used >= drive_size) {
                this.$message.error("当前账户可用空间不足");
                return false;
            } else {
                return true
            }
        },

        // 切片
        cutFileSlice(files) {
            let allFileSlice = []
            this.taskLength = files.length
            Array.from(files).forEach(file => {
                let fileName = file.name
                let start = 0;
                let total = 0
                let currentFile = []
                let fileSize = file.size
                while (start <= fileSize) {
                    start = total * this.chunkSize;
                    let [f_name, f_ext] = fileName.split(".");
                    let blob = file.slice(start, start + this.chunkSize);
                    let blob_name = `${f_name}.${total}.${f_ext}`;
                    let bolo_file = new File([blob], blob_name);
                    currentFile.push(bolo_file);
                    total += 1;
                    if (start >= fileSize) {
                        break;
                    }
                }
                allFileSlice.push({
                    fileInfo: {
                        fileName,
                        percentage: 0
                    },
                    total,
                    currentFile
                })
            })
            return allFileSlice
        },
        // 上传文件
        async upload(e) {
            var file = e.target.files[0];
            if (!file) return;
            if (!this.checkedAbleUpload()) return

            let fileParts = this.cutFileSlice(e.target.files)
            this.$Progress.init(fileParts)
            this.sendRequest(fileParts);
        },
        // 更新上传进度
        progressPerce(index, total) {
            let result = parseInt((index / total) * 100);
            return result == 100 ? 99 : result;
        },
        // 发送上传请求
        async sendRequest(fileParts) {
            fileParts.forEach(async filePart => {
                let index = 0;
                let total = filePart.total
                let list = filePart.currentFile,
                    listLength = list.length;
                for (let i = 0; i < listLength; i++) {
                    let formData = new FormData();
                    formData.append("file", list.shift());
                    await uploadFiles(formData);
                    index++;
                    filePart.fileInfo.percentage = this.progressPerce(index, total);
                    this.$Progress.update(fileParts)
                }
                setTimeout(() => {
                    this.mergeFile(filePart.fileInfo);
                }, 4000);
            })
        },
        // 合并文件
        mergeFile({ fileName }) {
            console.log(this);
            var file_id = getMD5(fileName);
            let { drive_id } = this.userInfo;
            let parent_file_id = this.parent_file_id;
            let parent_folder = this.parent_folder
            merge({
                drive_id,
                file_id,
                file_name: fileName,
                parent_file_id,
                parent_folder,
            }).then(async (res) => {
                this.loaded++;
                await this.getUserDrive();
                if (this.loaded == this.taskLength) {
                    this.$Progress.close()
                }
                this.$message.success(res.message);
                if (this.getUserFile) return this.getUserFile()
                this.$refs.folder.getUserFile();
            });
        },
        ...mapActions("user", ["getUserDrive"]),
    }

}
export default uploadFileMixin