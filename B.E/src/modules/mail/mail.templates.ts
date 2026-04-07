export const mailTemplates = {
    projectInvitation: (projectName: string, inviterName: string, hasAccount: boolean) => {
        const title = `Bạn được mời tham gia dự án ${projectName}`
        const registerPrompt = hasAccount
            ? ""
            : `<p>Có vẻ như bạn chưa có tài khoản trên TaskFlow. Hãy <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/register">đăng ký ngay</a> để bắt đầu làm việc nhé!</p>`

        const html = `
            <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #4A90E2;">Chào bạn!</h2>
                <p>Bạn đã được <strong>${inviterName}</strong> thêm vào dự án <strong>${projectName}</strong> trên hệ thống TaskFlow.</p>
                <p>Bây giờ bạn có thể truy cập vào hệ thống để xem chi tiết và bắt đầu quản lý các task của mình.</p>
                ${registerPrompt}
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 0.9em; color: #777;">
                    <p>Đây là email tự động, vui lòng không phản hồi email này.</p>
                    <p>&copy; 2026 TaskFlow Team</p>
                </div>
            </div>
        `
        return { subject: title, html }
    }
}
