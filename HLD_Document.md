# High Level Design (HLD) Document
## NexDesk Help Desk Ticketing System

### Document Information
- **Document Version**: 1.0
- **Created Date**: December 2024
- **Project**: NexDesk Help Desk Ticketing System
- **Technology Stack**: React TypeScript (Frontend), C#/.NET Core Web API (Backend), Microsoft SQL Server (Database)

---

## Table of Contents
1. [System Overview](#system-overview)
2. [Screen List and Categorization](#screen-list-and-categorization)
3. [Detailed Screen Specifications](#detailed-screen-specifications)
4. [Backend API Requirements](#backend-api-requirements)
5. [Database Design](#database-design)
6. [Security and Authentication](#security-and-authentication)

---

## System Overview

### Architecture Overview
The NexDesk Help Desk Ticketing System is a comprehensive support management platform built with:
- **Frontend**: React TypeScript with Vite
- **Backend**: C# .NET Core Web API
- **Database**: Microsoft SQL Server
- **Authentication**: JWT-based role-based authentication
- **Styling**: Tailwind CSS
- **Charts**: Recharts library

### User Roles
1. **Superadmin**: Full system access and management
2. **Admin**: Department/organization-level management
3. **Agent**: Ticket handling and customer support
4. **User**: End-user ticket creation and tracking

---

## Screen List and Categorization

### 1. Authentication Screens
| Screen ID | Screen Name | Route | Component File | User Role |
|-----------|-------------|-------|----------------|-----------|
| AUTH-01 | Login Screen | `/login` | `Login.tsx` | All |
| AUTH-02 | Register Screen | `/register` | `Register.tsx` | All |

### 2. Admin Dashboard & Management
| Screen ID | Screen Name | Route | Component File | User Role |
|-----------|-------------|-------|----------------|-----------|
| ADMIN-01 | Admin Dashboard | `/admin/dashboard` | `AdminDashboard.tsx` | Admin, Superadmin |
| ADMIN-02 | User Management | `/admin/manage/users` | `UsersViewContainer.tsx` | Admin, Superadmin |
| ADMIN-03 | Create User | `/admin/create/user` | `CreateUser.tsx` | Admin, Superadmin |
| ADMIN-04 | Edit User | `/admin/users/edit/:userId` | `EditUser.tsx` | Admin, Superadmin |
| ADMIN-05 | View User Detail | `/admin/users/view/:userId` | `ViewUser.tsx` | Admin, Superadmin |

### 3. Admin Ticket Management
| Screen ID | Screen Name | Route | Component File | User Role |
|-----------|-------------|-------|----------------|-----------|
| TICKET-01 | Ticket Management | `/admin/tickets` | `TicketManagement.tsx` | Admin, Superadmin |
| TICKET-02 | Create Ticket | `/admin/tickets/create` | `CreateTicket.tsx` | Admin, Superadmin |
| TICKET-03 | View Ticket Detail | `/admin/tickets/view/:ticketId` | `ViewTicketDetail.tsx` | Admin, Superadmin |
| TICKET-04 | Ticket Assignment | `/admin/tickets/assignment` | `TicketAssignment.tsx` | Admin, Superadmin |
| TICKET-05 | Ticket Tracking | `/admin/tickets/tracking` | `TicketTracking.tsx` | Admin, Superadmin |
| TICKET-06 | Ticket Summary | `/admin/tickets/summary` | `TicketSummary.tsx` | Admin, Superadmin |
| TICKET-07 | Ticket Analytics | `/admin/tickets/analytics` | `NewTicketSummary.tsx` | Admin, Superadmin |

### 4. Agent Dashboard & Ticket Management
| Screen ID | Screen Name | Route | Component File | User Role |
|-----------|-------------|-------|----------------|-----------|
| AGENT-01 | Agent Dashboard | `/agent/dashboard` | `AdminDashboard.tsx` | Agent |
| AGENT-02 | My Tickets | `/agent/tickets` | `ViewTickets.tsx` | Agent |
| AGENT-03 | Agent Ticket Detail | `/agent/tickets/view/:ticketId` | `ViewTicketDetail.tsx` | Agent |
| AGENT-04 | Ticket Assignment | `/agent/tickets/assignment` | `TicketAssignment.tsx` | Agent |

### 5. User Dashboard & Self-Service
| Screen ID | Screen Name | Route | Component File | User Role |
|-----------|-------------|-------|----------------|-----------|
| USER-01 | User Dashboard | `/user/dashboard` | `UserDashboard.tsx` | User |
| USER-02 | My Tickets | `/user/tickets` | `UserTicketManagement.tsx` | User |
| USER-03 | Create Ticket | `/user/create-ticket` | `UserCreateTicket.tsx` | User |
| USER-04 | View My Ticket | `/user/tickets/view/:ticketId` | `ViewTicket.tsx` | User |
| USER-05 | Edit My Ticket | `/user/tickets/edit/:ticketId` | `EditTicket.tsx` | User |

### 6. Knowledge Base Management
| Screen ID | Screen Name | Route | Component File | User Role |
|-----------|-------------|-------|----------------|-----------|
| KB-01 | Admin Knowledge Base | `/admin/knowledgebase` | `Knowledgebase.tsx` | Admin, Superadmin |
| KB-02 | Add Article | `/admin/knowledgebase/add` | `AddArticle.tsx` | Admin, Superadmin |
| KB-03 | Edit Article | `/admin/knowledgebase/edit/:id` | `EditArticle.tsx` | Admin, Superadmin |
| KB-04 | View Article (Admin) | `/admin/knowledgebase/view/:id` | `ViewArticle.tsx` | Admin, Superadmin |
| KB-05 | Delete Article | `/admin/knowledgebase/delete` | `DeleteArticle.tsx` | Admin, Superadmin |
| KB-06 | Agent Knowledge Base | `/agent/knowledgebase` | `Knowledgebase.tsx` | Agent |
| KB-07 | Agent Add Article | `/agent/knowledgebase/add` | `AddArticle.tsx` | Agent |
| KB-08 | Agent Edit Article | `/agent/knowledgebase/edit/:id` | `EditArticle.tsx` | Agent |
| KB-09 | Agent View Article | `/agent/knowledgebase/view/:id` | `ViewArticle.tsx` | Agent |
| KB-10 | User Knowledge Base | `/user/knowledgebase` | `UserKnowledgeBase.tsx` | User |
| KB-11 | User View Article | `/user/knowledgebase/view/:id` | `UserViewArticle.tsx` | User |

### 7. Feedback Management
| Screen ID | Screen Name | Route | Component File | User Role |
|-----------|-------------|-------|----------------|-----------|
| FB-01 | View Feedback (Admin) | `/admin/feedback` | `Feedback.tsx` | Admin, Superadmin |
| FB-02 | Feedback Detail (Admin) | `/admin/feedback/view/:feedbackId` | `ViewFeedbackDetail.tsx` | Admin, Superadmin |
| FB-03 | View Feedback (Agent) | `/agent/feedback` | `Feedback.tsx` | Agent |
| FB-04 | Feedback Detail (Agent) | `/agent/feedback/view/:feedbackId` | `ViewFeedbackDetail.tsx` | Agent |
| FB-05 | Create Feedback | `/user/feedback` | `CreateFeedback.tsx` | User |

### 8. Settings & Configuration
| Screen ID | Screen Name | Route | Component File | User Role |
|-----------|-------------|-------|----------------|-----------|
| SET-01 | Admin Settings | `/admin/settings` | `Settings.tsx` | Admin, Superadmin |
| SET-02 | General Settings | `/admin/settings/general` | `SettingsGeneral.tsx` | All |
| SET-03 | Password Settings | `/admin/settings/password` | `SettingsPassword.tsx` | All |
| SET-04 | Delete Account | `/admin/settings/delete` | `SettingsDelete.tsx` | Admin, Superadmin |
| SET-05 | Agent Settings | `/agent/settings` | `Settings.tsx` | Agent |
| SET-06 | Agent Preferences | `/agent/settings/preferences` | `SettingsPreferences.tsx` | Agent |
| SET-07 | User Settings | `/user/settings` | `Settings.tsx` | User |

---

## Detailed Screen Specifications

### 1.0 AUTH-01: Login Screen
**Component**: `Login.tsx` | **Route**: `/login` | **Access**: Public

#### Screen Name Logic
- Validate email format
- Check password strength
- Authenticate credentials via API
- Store JWT token on success
- Redirect based on user role
- Handle invalid credentials error
- **Special Case**: Account lockout after 5 failed attempts

#### Screen Name Fields

| No. | FIELD NAME | DATA TYPE | LENGTH | FIELD TYPE | REQUIRED | DEFAULT VALUE | DISPLAY FORMAT | EXAMPLE | REMARKS |
|-----|------------|-----------|--------|------------|----------|---------------|----------------|---------|---------|
| | | | MIN | MAX | | | | | | |
| 1 | Email | String | 5 | 255 | Textbox | Y | | email@domain.com | Valid email format |
| 2 | Password | String | 8 | 128 | Password | Y | | ******** | Min 8 chars, special chars required |
| 3 | Remember Me | Boolean | | | Checkbox | N | false | | | Session persistence |
| 4 | Login | Static | | | Button | Y | | | | Triggers authentication |
| 5 | Register Link | Static | | | Link | | | | | Navigate to registration |

---

### 1.1 ADMIN-01: Admin Dashboard
**Component**: `AdminDashboard.tsx` | **Route**: `/admin/dashboard` | **Access**: Admin, Superadmin

#### Screen Name Logic
- Load role-based statistics
- Filter data by department access
- Calculate KPI metrics
- Render charts with real-time data
- **Special Case**: Superadmin sees all departments, Admin sees assigned only

#### Screen Name Fields

| No. | FIELD NAME | DATA TYPE | LENGTH | FIELD TYPE | REQUIRED | DEFAULT VALUE | DISPLAY FORMAT | EXAMPLE | REMARKS |
|-----|------------|-----------|--------|------------|----------|---------------|----------------|---------|---------|
| | | | MIN | MAX | | | | | | |
| 1 | Total Tickets | Number | | | Display Card | | | 1,234 | Count of all tickets |
| 2 | Open Tickets | Number | | | Display Card | | | 45 | Status = 'Open' |
| 3 | In Progress | Number | | | Display Card | | | 23 | Status = 'In Progress' |
| 4 | Resolved | Number | | | Display Card | | | 89 | Status = 'Resolved' |
| 5 | Recent Tickets | Table | | | Data Grid | | | | Last 10 tickets |
| 6 | Department Chart | Chart | | | Pie Chart | | | | Distribution by dept |
| 7 | Priority Chart | Chart | | | Bar Chart | | | | High/Medium/Low breakdown |

---

### 1.2 TICKET-03: View Ticket Detail
**Component**: `ViewTicketDetail.tsx` | **Route**: `/admin/tickets/view/:ticketId` | **Access**: Admin, Superadmin, Agent

#### Screen Name Logic
- Load ticket by ID
- Verify user access permissions
- Display role-based actions
- Handle status transitions with validation
- Validate priority updates based on role
- **Special Case**: Agents only see assigned tickets
- **Special Case**: Users can only update their own tickets (limited status changes)
- **Special Case**: Status transition rules: Open → In Progress → Resolved → Closed
- **Abnormal Case**: Ticket not found - redirect to list
- **Abnormal Case**: Invalid status transition - show error message

#### Screen Name Fields

| No. | FIELD NAME | DATA TYPE | LENGTH | FIELD TYPE | REQUIRED | DEFAULT VALUE | DISPLAY FORMAT | EXAMPLE | REMARKS |
|-----|------------|-----------|--------|------------|----------|---------------|----------------|---------|---------|
| | | | MIN | MAX | | | | | | |
| 1 | Ticket ID | String | | | Static Label | | | TKT-001 | Auto-generated |
| 2 | Title | String | 10 | 255 | Textbox | Y | | Login Issue | Required field |
| 3 | Status | Enum | | | Dropdown | Y | Open | Open | Open/In Progress/Resolved/Closed | Agents/Admins can update |
| 4 | Priority | Enum | | | Dropdown | Y | Medium | High | Low/Medium/High/Critical | Support agents only |
| 5 | Customer Info | Object | | | Info Panel | | | John Doe | Read-only customer data |
| 6 | Description | Text | 10 | 2000 | Textarea | Y | | | Detailed description |
| 7 | Attachments | File | | | File List | N | | file.pdf | Download links |
| 8 | Comments | Array | | | Timeline | | | | Activity history |
| 9 | Assign Agent | Dropdown | | | Select | N | | Agent Name | Admin/Superadmin only |
| 10 | Update Status | Button | | | Action | | | | Save changes |

---

### 1.3 USER-02: My Tickets
**Component**: `UserTicketManagement.tsx` | **Route**: `/user/tickets` | **Access**: User

#### Screen Name Logic
- Load user's tickets only
- Apply filters and pagination
- **Special Case**: Empty state when no tickets exist

#### Screen Name Fields

| No. | FIELD NAME | DATA TYPE | LENGTH | FIELD TYPE | REQUIRED | DEFAULT VALUE | DISPLAY FORMAT | EXAMPLE | REMARKS |
|-----|------------|-----------|--------|------------|----------|---------------|----------------|---------|---------|
| | | | MIN | MAX | | | | | | |
| 1 | Status Filter | Multi-select | | | Dropdown | N | All | Open, Closed | Filter by status |
| 2 | Priority Filter | Multi-select | | | Dropdown | N | All | High, Medium | Filter by priority |
| 3 | Date Range | Date | | | Date Picker | N | Last 30 days | | From/To dates |
| 4 | Search | String | | 100 | Textbox | N | | Title or ID | Search in title/description |
| 5 | Ticket List | Table | | | Data Grid | | | | Paginated results |
| 6 | Create Ticket | Button | | | Action | | | | Navigate to create form |

---

### 1.4 TICKET-02: Create Ticket
**Component**: `CreateTicket.tsx` | **Route**: `/admin/tickets/create` | **Access**: Admin, Superadmin

#### Screen Name Logic
- Validate required fields
- Auto-assign department if admin
- Generate unique ticket ID
- Send notifications to stakeholders
- **Special Case**: Auto-assign to creator's department

#### Screen Name Fields

| No. | FIELD NAME | DATA TYPE | LENGTH | FIELD TYPE | REQUIRED | DEFAULT VALUE | DISPLAY FORMAT | EXAMPLE | REMARKS |
|-----|------------|-----------|--------|------------|----------|---------------|----------------|---------|---------|
| | | | MIN | MAX | | | | | | |
| 1 | Title | String | 10 | 255 | Textbox | Y | | Login Issue | Brief description |
| 2 | Customer | Dropdown | | | Select | Y | | John Doe | Search by name/email |
| 3 | Priority | Enum | | | Dropdown | Y | Medium | High | Business impact level |
| 4 | Department | Dropdown | | | Select | Y | Auto | IT Support | Based on issue type |
| 5 | Description | Text | 20 | 2000 | Textarea | Y | | | Detailed problem description |
| 6 | Attachments | File | | | Upload | N | | | Max 5 files, 10MB each |
| 7 | Assign Agent | Dropdown | | | Select | N | | Agent Name | Optional immediate assignment |
| 8 | Submit | Button | | | Action | | | | Create ticket |
| 9 | Save Draft | Button | | | Action | | | | Save without submitting |

---

### 1.5 KB-01: Knowledge Base
**Component**: `Knowledgebase.tsx` | **Route**: `/admin/knowledgebase` | **Access**: Admin, Superadmin

#### Screen Name Logic
- List published articles
- Search and filter functionality
- Role-based CRUD permissions
- **Special Case**: Draft articles only visible to authors

#### Screen Name Fields

| No. | FIELD NAME | DATA TYPE | LENGTH | FIELD TYPE | REQUIRED | DEFAULT VALUE | DISPLAY FORMAT | EXAMPLE | REMARKS |
|-----|------------|-----------|--------|------------|----------|---------------|----------------|---------|---------|
| | | | MIN | MAX | | | | | | |
| 1 | Search | String | | 100 | Textbox | N | | Password Reset | Search title/content |
| 2 | Category Filter | Dropdown | | | Select | N | All | Technical | Filter by category |
| 3 | Status Filter | Dropdown | | | Select | N | Published | Draft | Published/Draft/Archived |
| 4 | Article List | Table | | | Data Grid | | | | Title, Category, Author, Date |
| 5 | Add Article | Button | | | Action | | | | Create new article |
| 6 | Actions | Dropdown | | | Menu | | | | Edit/Delete/View per row |

---

### 1.6 SET-02: General Settings
**Component**: `SettingsGeneral.tsx` | **Route**: `/admin/settings/general` | **Access**: All roles

#### Screen Name Logic
- Load user profile data
- Validate email uniqueness
- Update profile information
- **Special Case**: Email change requires verification

#### Screen Name Fields

| No. | FIELD NAME | DATA TYPE | LENGTH | FIELD TYPE | REQUIRED | DEFAULT VALUE | DISPLAY FORMAT | EXAMPLE | REMARKS |
|-----|------------|-----------|--------|------------|----------|---------------|----------------|---------|---------|
| | | | MIN | MAX | | | | | | |
| 1 | First Name | String | 2 | 50 | Textbox | Y | Current | John | |
| 2 | Last Name | String | 2 | 50 | Textbox | Y | Current | Doe | |
| 3 | Email | String | 5 | 255 | Textbox | Y | Current | john@company.com | Unique validation |
| 4 | Department | String | | 100 | Display | | Current | IT Support | Read-only for non-admin |
| 5 | Role | String | | 50 | Display | | Current | Admin | Read-only |
| 6 | Phone | String | 10 | 15 | Textbox | N | Current | +1234567890 | Optional |
| 7 | Save Changes | Button | | | Action | | | | Update profile |
| 8 | Cancel | Button | | | Action | | | | Discard changes |

---

### 1.7 Ticket Status Update Functionality
**Access**: Users (limited), Agents, Admins, Superadmins

#### Status Update Rules
- **Users**: Can only update own tickets (Open → Closed only)
- **Agents**: Can update assigned tickets (Open → In Progress → Resolved)
- **Admins/Superadmins**: Can update any ticket (all status transitions)

#### Valid Status Transitions
| From Status | To Status | Allowed Roles | Business Rule |
|-------------|-----------|---------------|---------------|
| Open | In Progress | Agent, Admin, Superadmin | Must assign agent first |
| Open | Closed | User, Agent, Admin, Superadmin | User closes unwanted ticket |
| In Progress | Resolved | Agent, Admin, Superadmin | Solution provided |
| In Progress | Open | Agent, Admin, Superadmin | Escalation or re-opening |
| Resolved | Closed | Agent, Admin, Superadmin | Customer confirmed resolution |
| Resolved | In Progress | Agent, Admin, Superadmin | Issue not fully resolved |
| Closed | Open | Admin, Superadmin | Reopen closed ticket |

---

### 1.8 Ticket Priority Update Functionality
**Access**: Agents, Admins, Superadmins only

#### Priority Update Rules
- **Users**: Cannot update priority (read-only)
- **Agents**: Can update priority of assigned tickets
- **Admins/Superadmins**: Can update priority of any ticket

#### Priority Levels and Criteria
| Priority | SLA Response Time | Update Criteria | Escalation Rule |
|----------|------------------|-----------------|-----------------|
| Low | 24 hours | Minor issues, feature requests | No automatic escalation |
| Medium | 8 hours | Standard support requests | Escalate after 12 hours |
| High | 4 hours | Business impact, multiple users | Escalate after 6 hours |
| Critical | 1 hour | System down, security issues | Immediate escalation |

#### Priority Update Fields

| No. | FIELD NAME | DATA TYPE | LENGTH | FIELD TYPE | REQUIRED | DEFAULT VALUE | DISPLAY FORMAT | EXAMPLE | REMARKS |
|-----|------------|-----------|--------|------------|----------|---------------|----------------|---------|---------|
| | | | MIN | MAX | | | | | | |
| 1 | Current Priority | Display | | | Badge | | | High | Color-coded display |
| 2 | New Priority | Dropdown | | | Select | Y | Current | Critical | Low/Medium/High/Critical |
| 3 | Reason | Text | 10 | 500 | Textarea | Y | | | Justification required |
| 4 | Update Priority | Button | | | Action | | | | Apply changes |
| 5 | Priority History | Table | | | Data Grid | | | | Audit trail |
---

## Backend API Requirements

### Authentication Endpoints
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration  
- `POST /api/auth/refresh` - Token refresh
- `POST /api/auth/logout` - Session termination

### Ticket Management Endpoints
- `GET /api/tickets` - List tickets with filters
- `GET /api/tickets/{id}` - Get ticket details
- `POST /api/tickets` - Create new ticket
- `PUT /api/tickets/{id}` - Update ticket
- `PUT /api/tickets/{id}/assign` - Assign agent (Admin only)
- `PUT /api/tickets/{id}/status` - Update ticket status (role-based permissions)
- `PUT /api/tickets/{id}/priority` - Update ticket priority (Agent/Admin only)
- `POST /api/tickets/{id}/comments` - Add comment
- `GET /api/tickets/{id}/history` - Get status/priority change history

### User Management Endpoints
- `GET /api/users` - List users (Admin only)
- `GET /api/users/{id}` - Get user details
- `POST /api/users` - Create user (Admin only)
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user (Admin only)

### Analytics Endpoints
- `GET /api/analytics/tickets` - Ticket analytics
- `GET /api/analytics/agents` - Agent performance
- `GET /api/dashboard/admin` - Admin dashboard data
- `GET /api/dashboard/agent` - Agent dashboard data
    
    [HttpPost]
    public async Task<IActionResult> CreateUser([FromBody] CreateUserRequest request)
    
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserRequest request)
    
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
}
```

---

## Database Design

### Database Platform
- **Database Server**: Microsoft SQL Server 2019 or later
- **Authentication**: SQL Server Authentication / Windows Authentication
- **Collation**: SQL_Latin1_General_CP1_CI_AS
- **Recovery Model**: Full (for production)

### Core Tables

| Table Name | Purpose | Key Fields |
|------------|---------|------------|
| Users | User accounts and roles | Id, Email, Role, Department, IsActive |
| Tickets | Help desk tickets | Id, Title, Status, Priority, CustomerId, AssignedAgentId |
| TicketComments | Ticket communication | Id, TicketId, UserId, Comment, IsInternal |
| TicketAttachments | File uploads | Id, TicketId, FileName, FilePath, FileSize |
| TicketStatusHistory | Status change audit trail | Id, TicketId, OldStatus, NewStatus, ChangedBy, Reason, CreatedAt |
| TicketPriorityHistory | Priority change audit trail | Id, TicketId, OldPriority, NewPriority, ChangedBy, Reason, CreatedAt |
| KnowledgeBase | Articles and documentation | Id, Title, Content, Category, IsPublished |
| Feedback | Customer satisfaction | Id, TicketId, UserId, Rating, Comment |

### Key Constraints
- Users.Email: Unique, Email format validation
- Tickets.Status: Open, In Progress, Pending, Resolved, Closed (with transition validation)
- Tickets.Priority: Low, Medium, High, Critical (with role-based update permissions)
- Feedback.Rating: 1-5 scale
- TicketStatusHistory.Reason: Required for status changes (audit trail)
- TicketPriorityHistory.Reason: Required for priority changes (audit trail)

### Performance Indexes (Microsoft SQL Server)
```sql
-- Tickets table indexes
CREATE INDEX IX_Tickets_Status ON Tickets(Status);
CREATE INDEX IX_Tickets_Priority ON Tickets(Priority);
CREATE INDEX IX_Tickets_CustomerId ON Tickets(CustomerId);
CREATE INDEX IX_Tickets_AssignedAgentId ON Tickets(AssignedAgentId);
CREATE INDEX IX_Tickets_CreatedAt ON Tickets(CreatedAt);

-- Users table indexes
CREATE INDEX IX_Users_Role ON Users(Role);
CREATE INDEX IX_Users_Department ON Users(Department);
CREATE INDEX IX_Users_IsActive ON Users(IsActive);

-- Comments table indexes
CREATE INDEX IX_TicketComments_TicketId ON TicketComments(TicketId);
CREATE INDEX IX_TicketComments_CreatedAt ON TicketComments(CreatedAt);
```

### SQL Server Connection Configuration
```csharp
// appsettings.json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=NexDeskDB;Trusted_Connection=true;TrustServerCertificate=true;"
  }
}

// Program.cs or Startup.cs
services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));
```

---

## Security and Authentication

### JWT Configuration
- **Token Expiry**: 24 hours
- **Refresh Token**: 7 days
- **Claims**: UserId, Role, Department
- **Algorithm**: HS256

### Role-Based Access
| Role | Permissions |
|------|-------------|
| Superadmin | Full system access |
| Admin | Department management, all tickets |
| Agent | Assigned tickets, knowledge base |
| User | Own tickets, self-service |

### Security Measures
- Password hashing (BCrypt)
- Input validation and sanitization
- SQL injection prevention with parameterized queries
- XSS protection
- CORS configuration
- Rate limiting
- **Special Case**: Account lockout after 5 failed login attempts

### SQL Server Security Configuration
```csharp
// Entity Framework SQL Server security settings
services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseSqlServer(connectionString, sqlOptions =>
    {
        sqlOptions.EnableRetryOnFailure();
        sqlOptions.CommandTimeout(30);
    });
    options.EnableSensitiveDataLogging(false); // Production security
});
```
- Rate limiting for API endpoints

---

## Conclusion

This HLD document provides comprehensive specifications for the NexDesk Help Desk Ticketing System. The system supports multiple user roles with appropriate access controls, RESTful API design, and optimized database performance.

**Key Features**:
- Role-based authentication and authorization
- Comprehensive ticket management lifecycle
- Real-time analytics and reporting
- Knowledge base for self-service
- Feedback collection and analysis

**Technical Standards**:
- Responsive design with Tailwind CSS
- TypeScript for type safety
- JWT-based authentication
- Microsoft SQL Server with performance indexing
- RESTful API conventions
- C# .NET Core Web API backend
