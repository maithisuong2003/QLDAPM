const _script = {
    userAlready: `- Người chơi đã sẵn sàng!#- Chúng ta bắt đầu đi tìm 'Ai là triệu phú'.`,
    introducePart1: `- Có tất cả 15 câu trong một chương trình, và có 3 mốc quan trọng chúng tôi luôn muốn người chơi vượt qua là 5, 10, 15.#- Bạn có 3 sự trợ giúp là:#+ 50 - 50#+ Gọi điện thoại cho người thân#+ Hỏi ý kiến khán giả trong trường quay#- Bạn đã nắm rõ luật chơi chứ?`,
    introducePart2: `- Bạn đã vượt qua 5 câu hỏi đầu tiên của chúng tôi rất nhanh và trả lời đúng cả 5 câu hiện nay bạn đã chắc chắn có 2.000.000$ tiền thưởng.#- Nếu trả lời đúng ở câu số 6, bạn sẽ một phần thưởng trị giá 3.0000.000$. Và bắt đầu từ câu số 6, bạn có thêm một sự trợ giúp thứ tư là 'Tư vấn tại chỗ'.`,
    stopGame: (questionNumber) => {
        return `- Rất tiếc khi bạn phải dừng cuộc chơi. Bạn đã rất xuất sắc khi vượt qua ${questionNumber - 1
            } câu hỏi của chương trình. Bạn sẽ ra về với tấm set trị giá 1.000.000$ đồng. Chúc bạn luôn may mắn trong cuộc sống!`;
    },
    playAgain: `- Chơi lại?`,
    advisoryGroupHelper: `- Tổ tư vấn gồm có tất cả 5 người. Trong đó có 3 người biết chắc chắn câu lời đúng và 2 người còn lại thì không. Hãy chọn 3 người bất kì để được họ trợ giúp. Chúc bạn may mắn!`,
};
const Questions = {
    1: [
        {
            question: 'Câu 1: Có câu thành ngữ: "Đầu voi đuôi ..." gì? ',
            answers: [
                {
                    text: "A: Cá đuối",
                    id: 1,
                },
                {
                    text: "B: Gà mái",
                    id: 2,
                },
                {
                    text: "C: Chuột.",
                    id: 3,
                },
                {
                    text: "D: Chuồn chuồn",
                    id: 4,
                },
            ],
            correctId: 3,
            sound: "Sound/question-sound/question-1/1.mp3",
        },
        {
            question: "Câu 1: Từ nào sau đây chỉ tên một loại trái cây? ",
            answers: [
                {
                    text: "A: Ểnh ương",
                    id: 1,
                },
                {
                    text: "B: Cóc",
                    id: 2,
                },
                {
                    text: "C: Nhái bén",
                    id: 3,
                },
                {
                    text: "D: Mòng",
                    id: 4,
                },
            ],
            correctId: 2,
            sound: "Sound/question-sound/question-1/2.mp3",
        },
    ],
    2: [
        {
            question: "Câu 2: Tỉnh nào ở miền Nam?",
            answers: [
                {
                    text: "A: Nam Định",
                    id: 1,
                },
                {
                    text: "B: Ninh Bình",
                    id: 2,
                },
                {
                    text: "C: Bắc Ninh ",
                    id: 3,
                },
                {
                    text: "D: Bình Dương.",
                    id: 4,
                },
            ],
            correctId: 2,
            sound: "Sound/question-sound/question-2/1.mp3",
        },
        {
            question: "Câu 2: Đâu là tên một tập truyện nổi tiếng?",
            answers: [
                {
                    text: "A: Nghìn lẻ một năm",
                    id: 1,
                },
                {
                    text: "B: Nghìn lẻ một tháng",
                    id: 2,
                },
                {
                    text: "C: Nghìn lẻ một tuần",
                    id: 3,
                },
                {
                    text: "D: Nghìn lẻ một đêm",
                    id: 4,
                },
            ],
            correctId: 4,
            sound: "Sound/question-sound/question-2/2.mp3",
        },
    ],
    3: [
        {
            question: "Câu 3: Theo cách làm truyền thống thì chiếu được dệt từ gì?",
            answers: [
                {
                    text: "A: Tơ hồng",
                    id: 1,
                },
                {
                    text: "B: Dây gai",
                    id: 2,
                },
                {
                    text: "C: Rễ cây si",
                    id: 3,
                },
                {
                    text: "D: Cói",
                    id: 4,
                },
            ],
            correctId: 4,
            sound: "Sound/question-sound/question-3/1.mp3",
        },
    ],
    4: [
        {
            question: "Câu 4: Đâu là tên một ca khúc nổi tiếng của nhạc sĩ Đỗ Bảo?",
            answers: [
                {
                    text: "A: Giấy đòi nợ đầu tiên",
                    id: 1,
                },
                {
                    text: "B: Lời thăm dò đầu tiên",
                    id: 2,
                },
                {
                    text: "C: Bức thư tình đầu tiên",
                    id: 3,
                },
                {
                    text: "D: Lần lừa dối đầu tiên",
                    id: 4,
                },
            ],
            correctId: 3,
            sound: "Sound/question-sound/question-4/1.mp3",
        },
    ],
    5: [
        {
            question: "Trong bảng tuần hoàn Mendeleev, nguyên tố hóa học Poloni được viết như thế nào?",
            answers: [
                {
                    text: "A: K",
                    id: 1,
                },
                {
                    text: "B: NA",
                    id: 2,
                },
                {
                    text: "C: Ba",
                    id: 3,
                },
                {
                    text: "D: Po",
                    id: 4,
                },
            ],
            correctId: 4,
            sound: "Sound/question-sound/question-5/1.mp3",
        },
    ],