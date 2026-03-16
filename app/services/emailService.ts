export interface Task {
  id: string;
  title: string;
  description: string;
  assignerId: string;
  assignerName: string;
  assigneeId: string;
  assigneeName: string;
  assigneeEmail: string;
  dueDate?: string;
  status: 'assigned' | 'in-progress' | 'completed';
  createdAt: string;
  completedAt?: string;
  points?: number;
}

export interface EmailPayload {
  to: string;
  cc?: string;
  subject: string;
  taskId: string;
  taskTitle: string;
  assignerName: string;
  assigneeName: string;
  dueDate?: string;
  status: string;
  timestamp: string;
  taskLink: string;
  message: string;
}

/**
 * Mock email service - simulates sending emails
 * In production, this would call a backend API
 */
export const emailService = {
  /**
   * Send email when task is assigned
   */
  sendTaskAssignedEmail: async (task: Task): Promise<boolean> => {
    const emailPayload: EmailPayload = {
      to: task.assigneeEmail,
      cc: 'admin@lawfirm.com', // Optional CC to admin
      subject: `New Task Assigned: ${task.title}`,
      taskId: task.id,
      taskTitle: task.title,
      assignerName: task.assignerName,
      assigneeName: task.assigneeName,
      dueDate: task.dueDate,
      status: 'Assigned',
      timestamp: task.createdAt,
      taskLink: `${window.location.origin}/dashboard?task=${task.id}`,
      message: `You have been assigned a new task: "${task.title}". Please review the details and complete it by ${task.dueDate || 'the deadline'}.`,
    };

    console.log('📧 Sending Task Assignment Email:', emailPayload);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return true;
  },

  /**
   * Send email when task is completed
   */
  sendTaskCompletedEmail: async (task: Task): Promise<boolean> => {
    const emailPayload: EmailPayload = {
      to: 'admin@lawfirm.com', // Send to admin/task owner
      cc: task.assigneeEmail, // Optional CC to assignee
      subject: `Task Completed: ${task.title}`,
      taskId: task.id,
      taskTitle: task.title,
      assignerName: task.assignerName,
      assigneeName: task.assigneeName,
      dueDate: task.dueDate,
      status: 'Completed',
      timestamp: task.completedAt || new Date().toISOString(),
      taskLink: `${window.location.origin}/dashboard?task=${task.id}`,
      message: `${task.assigneeName} has completed the task: "${task.title}". Points earned: ${task.points || 0}.`,
    };

    console.log('📧 Sending Task Completion Email:', emailPayload);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return true;
  },

  /**
   * Generate email preview HTML (for testing)
   */
  generateEmailHTML: (payload: EmailPayload): string => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4F46E5; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
          .footer { background: #333; color: white; padding: 15px; border-radius: 0 0 8px 8px; text-align: center; }
          .button { background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 0; }
          .details { background: white; padding: 15px; border-left: 4px solid #4F46E5; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Task Management System</h2>
          </div>
          <div class="content">
            <h3>${payload.subject}</h3>
            <p>${payload.message}</p>
            
            <div class="details">
              <strong>Task Details:</strong><br/>
              <strong>Task ID:</strong> ${payload.taskId}<br/>
              <strong>Title:</strong> ${payload.taskTitle}<br/>
              <strong>Assigned by:</strong> ${payload.assignerName}<br/>
              <strong>Assigned to:</strong> ${payload.assigneeName}<br/>
              ${payload.dueDate ? `<strong>Due Date:</strong> ${payload.dueDate}<br/>` : ''}
              <strong>Status:</strong> ${payload.status}<br/>
              <strong>Timestamp:</strong> ${new Date(payload.timestamp).toLocaleString()}<br/>
            </div>
            
            <a href="${payload.taskLink}" class="button">View Task Details</a>
          </div>
          <div class="footer">
            <p>This is an automated email from Task Management System</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
};
