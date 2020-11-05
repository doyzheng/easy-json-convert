module.exports = [
    {
        'data': {
            'titleId@projectId': 'PROJECT20191126010000000163',
            'titleName@projectName': '二级建造师',
            'titleImgPath@projectSummarypicture': '2020/05/25/15903676412480379.png',
            'id@classtypeId': 'CLASSTYPE20200701020000000005',
            'name@classtypeName': '2020二级建造师企业无忧班A【三期】',
            'coverImgPath@classtypeAppcoverimgurl': '2020/07/07/15941044692490848.png',
            'minPrice@MinPrice': 300000,
            'maxPrice@MaxPrice': 980000,
            'maxOfficialPrice@stdmaxPrice': 980000,
            'minOfficialPrice@stdminPrice': 300000,
            'ifContainsTrialPart@classtypeAuditionstatus': true,
            'totalBoughtTimes@classtypeOrdercount': 3217,
            '*introduction_app@classtypeIntroduceapp': {
                type: 'string',
                filter: function(val) {
                    const schema = this.schema;
                    const convert = this.convert;
                    const list = JSON.parse(val || '[]');
                    return convert(list, schema([
                        {
                            'anchorName@linkType': '',
                            'anchorContent@data': [
                                {
                                    'templateId@type': 'img',
                                    'videoTitle@title': 'title',
                                    'videoId@src': 'src',
                                    'imgTitle@title': 'title',
                                    'imgPath@src': '2020/07/22/15954063030060299.png',
                                    'imgTitleSerialNumber@titleNum': '',
                                    'imgListTitle@title': '',
                                    'imgListTitleSerialNumber@': 'titleNum',
                                    'imgListContent@content': [
                                        {
                                            'title@title': '',
                                            'titleSerialNumber@titleNum': '',
                                            'imgPath@src': '',
                                        }],
                                    'letterTitle@title': '',
                                    'letterContent@desc': '',
                                    'letterSignature@footer': '',
                                    'paragraphTitle@title': '',
                                    'paragraphSubtitle@subTitle': '',
                                    'paragraphContent@desc': '',
                                    'teacherTitle@title': '',
                                    'teacherSubtitle@subTitle': '',
                                    'teacherTitleSerialNumber@titleNum': '',
                                    'teacherList@teacherList': [
                                        {
                                            'id@teacherId': '',
                                        }],
                                }],
                        }]));
                },
            },
            '*completeSubjectList@generalObjects': [
                {
                    'name@subjectName': '水利水电3科',
                    'id@subjectId': 'SUBJECT20191126010000000198',
                    'classList@classes': [
                        {
                            'isInPromotion@classPromotionstatus': false,
                            'price@classPrice': 0,
                            'officialPrice@classStdprice': 980000,
                            'sourceId@classSourceid': '9fec3248-00a2-4055-bb99-1a838396e21a',
                            'agreement@classAsertype': 'refundable',
                            'agreementRepresentation@classAtype': 'electronic',
                            'agreementText@classAsertypename': '不过退费',
                            'totalBuyerCount@classOrdercount': 259,
                            'id@classId': 'CLASS20200701020000000024',
                            'name@className': '2020二级建造师企业无忧班A【三期】水利水电3科',
                        }],
                }],
            '*singleSubjectList@singleObjects': [
                {
                    'name@subjectName': '施工管理',
                    'id@subjectId': 'SUBJECT20191126010000000385',
                    'classList@classes': [
                        {
                            'isInPromotion@classPromotionstatus': false,
                            'price@classPrice': 0,
                            'officialPrice@classStdprice': 300000,
                            'sourceId@classSourceid': '9fec3248-00a2-4055-bb99-1a838396e21a',
                            'agreement@classAsertype': 'refundable',
                            'agreementRepresentation@classAtype': 'electronic',
                            'agreementText@classAsertypename': '不过退费',
                            'totalBuyerCount@classOrdercount': 261,
                            'id@classId': 'CLASS20200701020000000025',
                            'name@className': '2020二级建造师企业无忧班A【三期】施工管理',
                        }],
                }],
        },

    }];
