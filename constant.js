const _script = {
    userAlready: `- Người chơi đã sẵn sàng!#- Chúng ta bắt đầu đi tìm 'Ai là triệu phú'.`,
    introducePart1: `- Có tất cả 15 câu trong một chương trình, và có 3 mốc quan trọng chúng tôi luôn muốn người chơi vượt qua là 5, 10, 15.#- Bạn có 3 sự trợ giúp là:#+ 50 - 50#+ Gọi điện thoại cho người thân#+ Hỏi ý kiến khán giả trong trường quay#- Bạn đã nắm rõ luật chơi chứ?`,
    introducePart2: `- Bạn đã vượt qua 5 câu hỏi đầu tiên của chúng tôi rất nhanh và trả lời đúng cả 5 câu hiện nay bạn đã chắc chắn có 2.000.000$ tiền thưởng.#- Nếu trả lời đúng ở câu số 6, bạn sẽ một phần thưởng trị giá 3.0000.000$. Và bắt đầu từ câu số 6, bạn có thêm một sự trợ giúp thứ tư là 'Tư vấn tại chỗ'.`,
    stopGame: (questionNumber) => {
        return `- Rất tiếc khi bạn phải dừng cuộc chơi. Bạn đã rất xuất sắc khi vượt qua ${
            questionNumber - 1
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
                    text: "B: Bình Dương",
                    id: 2,
                },
                {
                    text: "C: Ninh Bình ",
                    id: 3,
                },
                {
                    text: "D: Bắc Ninh.",
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
    6: [
        {
            question: "Câu 6: Biểu tượng của mạng xã hội Twitter là hình gì?",
            answers: [
                {
                    text: "A: Con chim xanh",
                    id: 1,
                },
                {
                    text: "B: Máy ảnh",
                    id: 2,
                },
                {
                    text: "C: Hai hình tròn xanh và hồng",
                    id: 3,
                },
                {
                    text: "D: Cột sóng wifi",
                    id: 4,
                },
            ],
            correctId: 1,
            sound: "Sound/question-sound/question-6/1.mp3",
        },
    ],
    7: [
        {
            question: `Câu 7: Bài hát "Tàu anh qua núi" do nhạc sĩ nào sáng tác?`,
            answers: [
                {
                    text: "A: Phạm Tuyên",
                    id: 1,
                },
                {
                    text: "B: Hoàng Việt",
                    id: 2,
                },
                {
                    text: "C: Phan Lạc Hoa",
                    id: 3,
                },
                {
                    text: "D: Đỗ Nhuận",
                    id: 4,
                },
            ],
            correctId: 3,
            sound: "Sound/question-sound/question-7/1.mp3",
        },
    ],
    8: [
        {
            question: "Câu 8: Lục địa nào là quê hương của những câu chuyện ngụ ngôn Timbuktu?",
            answers: [
                {
                    text: "A: Châu Mỹ",
                    id: 1,
                },
                {
                    text: "B: Châu Phi",
                    id: 2,
                },
                {
                    text: "C: Châu Á",
                    id: 3,
                },
                {
                    text: "D: Châu Đại Dương",
                    id: 4,
                },
            ],
            correctId: 2,
            sound: "Sound/question-sound/question-8/1.mp3",
        },
    ],
    9: [
        {
            question: "Câu 9: Thành phố nào sau đây không nằm trong lãnh thổ nước Nga?",
            answers: [
                {
                    text: "A: Smolensk",
                    id: 1,
                },
                {
                    text: "B: Kursk",
                    id: 2,
                },
                {
                    text: "C: Minsk",
                    id: 3,
                },
                {
                    text: "D: Khabarovsk",
                    id: 4,
                },
            ],
            correctId: 3,
            sound: "Sound/question-sound/question-9/1.mp3",
        },
    ],
    10: [
        {
            question: `Câu 10: Diễn viên nào đảm nhận vai "Tùng Hero" trong phim "Hương Ga"?`,
            answers: [
                {
                    text: "A: Chi Bảo",
                    id: 1,
                },
                {
                    text: "B: Hà Việt Dũng",
                    id: 2,
                },
                {
                    text: "C: Harry Lu",
                    id: 3,
                },
                {
                    text: "D: Kim Lý",
                    id: 4,
                },
            ],
            correctId: 4,
            sound: "Sound/question-sound/question-10/1.mp3",
        },
    ],
};
const resource = {
    images: [
        "./Image/50-50-used.webp",
        "./Image/50-50.webp",
        "./Image/advisory-group-used.webp",
        "./Image/advisory-group.webp",
        "./Image/answer-table.webp",
        "./Image/ask-viewer-used.webp",
        "./Image/avatar.jpg",
        "./Image/call-used.webp",
        "./Image/normal-l.png",
        "./Image/normal-r.png",
        "./Image/selected-r.png",
        "./Image/selected.png",
        "./Image/correct.png",
        "./Image/correct-r.png",
        "./Image/question.png",
        "./Image/point-table.webp",
        "./Image/current-money.png",
        "./Image/cartoon.png",
        "./Image/guide-background.webp",
        "./Image/call.webp",
        "./Image/call-used.webp",
        "./Image/ask-viewer.webp",
        "./Image/money-point.png",
    ],
    audios: [
        "./Sound/start-sound.mp3",
        "./Sound/explain-rule-bg-sound.mp3",
        "./Sound/explain-rule.mp3",
        "./Sound/start-game.mp3",
        "./Sound/first5BgSound.mp3",
        "./Sound/final-answer.mp3",
        "./Sound/game-over.mp3",
        "./Sound/wrong-sound.mp3",
        "./Sound/ask-advisory-group-bg-sound.mp3",
        "./Sound/ask-advisory-group-done.mp3",
        "./Sound/ask-advisory-group.mp3",
        "./Sound/ask-viewer-sound.mp3",
        "./Sound/introduce-part2.mp3",
        "./Sound/next5BgSound.mp3",
        "./Sound/remove-wrong.mp3",
        "./Sound/win-5.mp3",
        "./Sound/wait-viewer-answer.mp3",
        "./Sound/time-up.mp3",
    ],
};
const PrizeMoney = {
    15: "150.000.000",
    14: "85.000.000",
    13: "60.000.000",
    12: "40.000.000",
    11: "30.000.000",
    10: "22.000.000",
    9: "14.000.000",
    8: "10.000.000",
    7: "6.000.000",
    6: "3.000.000",
    5: "2.000.000",
    4: "1.000.000",
    3: "600.000",
    2: "400.000",
    1: "200.000",
};
