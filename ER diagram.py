import graphviz

# Define the ERD using Graphviz
dot = graphviz.Digraph(comment='Online Job Portal ERD', format='png')

# Define entities
dot.node('User', '''User
----------
UserID (PK)
Name
Email
Password
UserType
DateCreated''')

dot.node('JobSeeker', '''JobSeeker
----------
SeekerID (PK, FK)
Resume
Skills
Experience
Education''')

dot.node('Employer', '''Employer
----------
EmployerID (PK, FK)
CompanyName
CompanyDescription
Industry
Location''')

dot.node('Job', '''Job
----------
JobID (PK)
EmployerID (FK)
Title
Description
Location
Salary
EmploymentType
PostedDate
Deadline''')

dot.node('Application', '''Application
----------
ApplicationID (PK)
JobID (FK)
SeekerID (FK)
ApplicationDate
Status''')

dot.node('Message', '''Message
----------
MessageID (PK)
SenderID (FK)
ReceiverID (FK)
MessageText
Timestamp''')

dot.node('Interview', '''Interview
----------
InterviewID (PK)
ApplicationID (FK)
InterviewDate
InterviewType
InterviewStatus''')

# Define relationships
dot.edges([
    ('User', 'JobSeeker'),
    ('User', 'Employer'),
    ('Employer', 'Job'),
    ('JobSeeker', 'Application'),
    ('Job', 'Application'),
    ('Application', 'Interview'),
    ('User', 'Message'),
    ('Message', 'User')
])

dot.render('online_job_portal_erd', view=True)
