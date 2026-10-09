const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

// ============================================================
// FULL STUDENT DATA — embedded directly from the user's dataset
// ============================================================
const STUDENT_DATA = [
["UAI02BI12501","Aakansha S. Rathore","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02BI22501","Aashika Singh","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MGM2562","Aastha Wadodkar","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MFC2501","Abhigyan Shukla","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02BI22502","Abhishek Kumar Kashyap","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02BI12502","Adarsh Nema","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MFC2547","Adish Ajmera","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MGM2501","Aditi Singh","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02BI22546","Aditya Raj","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MGM2502","Agradip Kirtania","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02BI22503","Agrawal Luvkishan Manojkumar","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02BI22539","Aisha Patel","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MGM2504","Aishwarya Sharma","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02BI12504","Akash Pandey","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MFC2502","Akhil Prasad Alex Prasad Simitha","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MFC2503","Akshat Gupta","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02BI12505","Akshat Sonkusale","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MBA2501","Akshay Pangaria","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MGM2505","Allam Sri Rushyanth","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MBA2502","Aman Jain","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02BI22504","Amit Nayak","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MGM2506","Anchal Pandey","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MGM2507","Angkur Patowary","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MGM2508","Aniket Rajesh Karande","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MGM2509","Aniket Singh","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MGM2510","Anjaly Dubey","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MGM2511","Ankita Chakraborty","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MFC2505","Ansh Gupta","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02BI22562","Anubhav Shresth","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02BI22505","Anubhuti Singh","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02BI12506","Anushka Choudhary","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MBA2503","Aprajita","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02BI12507","Arihant Jain","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MFC2540","Arjun Chaturvedi","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02BI22506","Armaan Vaid","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02BI12509","Arnab Das","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02BI22507","Arnab Pradhan","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02BI22508","Aryan Tripathi","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MBA2504","Ashutosh Sadashiv Nawale","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02BI22509","Ashvitha Srinivas Karturi","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MGM2512","Aswin Sp","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MGM2513","Avnish Mishra","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MBA2505","Ayush Agrawal","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MGM2514","Ayush Chowdhury","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MFC2542","Ayush Raj","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02BI12510","B Piyush Gandhi","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02BI12511","Bhaghya Ajith","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MGM2515","Bhavana Ajith","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MBA2506","Bhavesh Solanki","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MBA2507","Bhoomika Mulchandani","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MBA2508","Bindia Rani","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02BI22559","Chirag Suhalka","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MBA2509","Chitranshi Modi","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02BI22510","Christopher Morgan Pereira","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MGM2516","Dakshi Deepak Gala","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MGM2517","Danika Sabina Maureen Pinto","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MBA2510","Debargha Biswas","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02BI12512","Deebhansh Vaya","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02BI12513","Deeksha Sharma","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MBA2511","Deepa Saini","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MBA2512","Deepali Gupta","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MBA2513","Deewanshi Khatri","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MFC2539","Devansh Kukreja","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02BI22512","Devvrath Singh Chauhan","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02BI12568","Dhairya Sanjay Maraskolhe","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02BI12514","Dhanashree Dadasaheb Barbade","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02BI12515","Diksha Raghuwanshi","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02BI12516","Dilpreet Singh","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MGM2518","Disha Gupta","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MFC2538","Disha Tanpure","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MBA2514","Divya Chaturvedi","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MBA2516","Drishti Rathore","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02BI22537","Gargeya Makarand Bapat","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02BI12565","Gaurav Kumar Jha","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02BI22540","Gayatri Shriram Deshmukh","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MBA2517","Ghulannawar Pranjal Anil","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02BI12517","Gopavarapu Sreekar","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02BI22535","Grivesh Panwar","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MFC2550","Gurjeet Singh","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MGM2561","Gun Gupta","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02BI12519","Gyan Ranjit Hegde","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02BI22563","Hardik Lodha","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02BI12520","Harini R","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02BI22514","Harman Singh Bhatia","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MGM2519","Harsh Arvind Gala","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MGM2520","Harsh Gupta","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MGM2521","Harshit Indrabahadur Kunwar","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02BI22550","Harshit Sharma","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02BI12521","Hitesh Agarwal","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MGM2522","Hotri Raval","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MFC2508","Hrittika Mohata","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02BI22560","Jay Kishan Raj","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MGM2523","Jumnani Taniya Amarlal","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MGM2524","Jyoti","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MGM2525","Kajal Mishra","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MGM2526","Kameshwari Sugandhi","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MFC2509","Kanishka Upadhyay","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02BI22555","Karishma Madhogaria","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MFC2510","Kavya Gupta","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02BI22516","Kavya Omprakash Saxena","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MGM2527","Kavya Sigotiya","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02BI12523","Khushi Jain","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02BI22557","Khushi Lalit Sonare","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02BI12524","Khushi Mantasha","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02BI22517","khushi Neha","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MGM2528","Khushi Prajapati","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02BI22545","Khushi Sachdev","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02BI22536","Kilaparthi Jay Kartik","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MGM2529","Komal Kumari","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02BI12525","Koppula Siri Vennela","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MGM2530","Krishna Wagh","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MGM2531","Kunwar Shivansh Singh","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MFC2512","Kushagra Kartikey","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MBA2518","Mahek Kushwah","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MBA2560","Mahi Vashisht","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MBA2519","Manav Chomal","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MGM2532","Mandvi Singh Baghel","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MBA2520","Manish Kumar","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02BI12526","Manish Kumar Pandey","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02BI22518","Manish Manhas","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MFC2541","Mayank Tiwari","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MGM2558","Mayur Yadav","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02BI12528","Mehta Hinal Priteshkumar","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02BI22519","Mitanshu Agrawal","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MBA2521","Modi Vidhiben Pankajkumar","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02BI12529","Mohi Mayank Jain","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02BI22549","Mude Tanishq Anil","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02BI22538","Mudit Babel","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MBA2522","Naman Jain","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02BI12530","Nikhil Nishad","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MBA2523","Nikhil Verma","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MGM2560","Nisarg Dilipbhai Solanki","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02BI12531","Nishad Ravindra Umap","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MBA2557","Nishant Mishra","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MGM2533","Nishi Garg","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MBA2524","Nishi Jain","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02BI22520","Nupur Kumawat","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MBA2525","Pal Jain","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02BI12532","Palak Jain","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MBA2526","Palak Talreja","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02BI12533","Palli Harshi Meghana","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MGM2534","Parthiv Raj Ghosh","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MGM2535","Parul Naidu","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02BI12534","Pattubisai Yamini Choudhary","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MFC2518","Pearl Choudhary","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02BI12536","Piyush Chourpagar","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MFC2519","Piyush Thakkar","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02BI12564","Poorvi Jain","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02BI12537","Prachi Bihani","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MGM2536","Prachi Priya","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MFC2537","Prajjwal Mahesh Thakur","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MFC2520","Prakash Kumar","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MFC2535","Prateek Nashine","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02BI22521","Prathmesh Kumar Singh","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02BI12539","Priya Aggarwal","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02BI12569","Priyal Singh Parihar","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02BI12540","Priyanka Ngangkham","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MGM2537","Priyanshi Mewara","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02BI12541","Priyanshu Pandey","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MBA2527","Purba Akuria","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02BI12542","Purnima Kumari","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02BI12543","Rahul Choubey","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MFC2521","Raj Kumar","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MBA2528","Raj Patel","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MGM2538","Raj Sanjay Chaudhari","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02BI22522","Rajatabh Chaturvedi","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02BI12567","Ram Krishna Arya","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02BI22523","Ramanpreet Singh","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MBA2529","Ramchandani Dev Laxmandas","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02BI22524","Rashika Raj","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MBA2530","Rasika Ajay Gupta","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02BI22543","Rishabh Kumar Jha","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02BI22551","Rishabh Nagendra Singh","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02BI12562","Rishav Anand","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MFC2523","Rishav Pandey","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02BI22525","Ritika Mishra","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MBA2531","Rituja Pal","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MGM2539","Riya Arora","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MBA2532","Ruchit Rajeshbhai Bhalodiya","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02BI22526","Rudransh Choudhary","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MBA2533","Rutvi Mineshkumar Parekh","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MBA2534","S Neharika Reddy","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MGM2540","Sadakshya Sharma","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MBA2535","Sahil Chaitanya Shipurkar","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02BI22527","Sahil Rai","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MBA2536","Saikat Mishra","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MGM2541","Sairaj Mohanty","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MBA2537","Sajal Gupta","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MGM2542","Sakshi Konadkar","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MFC2545","Sakshi Panwar","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MBA2538","Sakshi Yadav","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02BI22541","Saloni Sandeep Samarth","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02BI12545","Sameer Singh","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MGM2559","Samruddhi Kamlakar Chaudhari","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MGM2543","Sangram Moharana","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MBA2539","Sanika Santosh Patil","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MFC2546","Saniya Nenawati","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02BI12546","Sapna","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02BI22529","Sara Chintale","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MFC2524","Sarthak Anil Shahasane","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02BI22530","Satvik Kochar","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MGM2544","Shashwati Mehra","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MBA2541","Shikha Kumari","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02BI22547","Shikha Mehta","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MFC2533","Shivam Mishra","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MGM2545","Shivam Patel","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02BI12548","Shivam Prabhakar Khandait","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MBA2542","Shreya Anand","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02BI22531","Shreyansh Jain","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02BI22554","Shruti Chouhan","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02BI12549","Shruti Janjire","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02BI12550","Shubh Sharma","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02BI12551","Shubham Ghosh Hazra","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02BI12552","Shubham Rathi","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02BI22542","Shubhit Sharma","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02BI12553","Siddhant Goutam","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MFC2527","Sifti Khanuja","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MGM2546","Simran Banait","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02BI22532","Sk Nesaruddin","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MGM2547","Sneha Agarwal","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MBA2543","Sojwal Agarkar","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02BI12554","Srihari V","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MGM2548","Sristi Chatterjee","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02BI22533","Steevo Alms","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MGM2549","Subham Palit","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02BI22556","Sujal Milind Pachpande","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02BI22544","Sunandita Maity","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MBA2544","Surbhi Priya","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02BI12555","Susagar Soumen Roy","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MBA2545","Sushrit Soni","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02BI22553","Swarashree Mondal","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02BI22561","Swarna Kashyap","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MFC2536","Swasti Nagar","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MGM2551","Swati Sanjay Jha","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MBA2546","Tanisha Omar","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02BI22534","Tanishk Patel","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MBA2547","Tanishqa Bhatia","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MBA2548","Tank Aditya Vijaykumar","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MBA2549","Tanni Saha","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MGM2552","Tejas Shyam Matre","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MBA2550","Thaore Advait Jitendra","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02BI12556","Truptimayee Rout","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MBA2551","Tushar Manoj Motwani","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02BI12557","Udaypratapsingh Rajput","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MBA2552","Urmil Bohra","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MBA2553","Utkarsh Shukla","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MBA2554","Utkarsh Tiwari","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MFC2528","Vaibhav Navle","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MFC2529","Vaishali Mehta","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MBA2555","Vaishnavi Bhushan Hiremath","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02BI12558","Vaishnavi Gupta","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MGM2553","Vallabh Dixit","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MGM2554","Vanshika Masoun","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MGM2555","Varun Dutta","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MFC2530","Vedant Jagdish Sharma","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02BI12566","Vedant Mohan Tamboli","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02BI12559","Vikramaditya Singh Panwar","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MBA2556","Vinal Jain","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MGM2556","Vishal Lekhwani","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MGM2557","Vivek Pradhan","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02BI22548","Vratika Jain","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MFC2544","Yash Prakash Pardeshi","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MFC2532","Yashita Dhanjani","School of Management PG","MBA","2nd Year PG","Female"],
["UAI02MBA2558","Yogendra Mahendra Yadav","School of Management PG","MBA","2nd Year PG","Male"],
["UAI02MFC2511","Khushi Bhatia","School of Management PG","MBA","2nd Year PG","Female"],
["UAI06BTD2404","Harsh Khamkar","School of AI & Future Technologies","AI & ML","3rd Year UG","Male"],
["UAI04BBA2401","Aadi Jain","School of Management UG","BBA","3rd Year UG","Male"],
["UAI04BBA2403","Alok Tala","School of Management UG","BBA","3rd Year UG","Male"],
["UAI04BBA2423","Anmol Tripathi","School of Management UG","BBA","3rd Year UG","Male"],
["UAI04BBA2404","Arfaat Ajaz Ahmed Quarishi","School of Management UG","BBA","3rd Year UG","Male"],
["UAI04BBA2501","Aaryan Singhrajput","School of Management UG","BBA","2nd Year UG","Male"],
["UAI04BBA2405","Armeen Shaikh","School of Management UG","BBA","3rd Year UG","Female"],
["UAI04BBA2406","Aryamaan Abhijit Roy","School of Management UG","BBA","3rd Year UG","Male"],
["UAI09BAM2503","Aayush Anandkumar Mourya","School of Music, Sound & Cinematics","Music","2nd Year UG","Male"],
["UAI09BAM2501","Avinendra Palaria","School of Music, Sound & Cinematics","Music","2nd Year UG","Male"],
["UAI08BTS2501","Dawin Prakash","School of Music, Sound & Cinematics","Music","2nd Year UG","Male"],
["UAI10BSP2401","Arshia Agicha","School of Liberal Arts, Behavioural and Social Sciences","Psychology","3rd Year UG","Female"],
["UAI10BSP2501","Adrika Sudhakar Srivastava","School of Liberal Arts, Behavioural and Social Sciences","Psychology","2nd Year UG","Female"],
["UAI12BDS2501","Bhumi Bafna","School of Design","Design","2nd Year UG","Female"],
["UAI12BDS2504","Khushi Varma","School of Design","Design","2nd Year UG","Female"],
["UAI12BDS2502","Naveen Kumar","School of Design","Design","2nd Year UG","Male"],
["UAI12BDS2503","Yashwi Kothari","School of Design","Design","2nd Year UG","Female"],
["UAI05BT12402","Aarav Pastay","School of AI & Future Technologies","AI & ML","3rd Year UG","Male"],
["UAI05BT12403","Abdullah Shaikh","School of AI & Future Technologies","AI & ML","3rd Year UG","Male"],
["UAI05BT22401","Aditya Pathak","School of AI & Future Technologies","AI & ML","3rd Year UG","Male"],
["UAI05BT12501","Abdullah Shah","School of AI & Future Technologies","AI & ML","2nd Year UG","Male"],
["UAI05BT12502","Aditya Anand","School of AI & Future Technologies","AI & ML","2nd Year UG","Male"],
["UAI05BTA2320","Abhishek Bhavsar","School of AI & Future Technologies","AI & ML","4th Year UG","Male"],
["UAI05BTA2309","Arryaan Jain","School of AI & Future Technologies","AI & ML","4th Year UG","Male"],
];

async function main() {
  console.log('🏟️  UAI Sports OS — Database Seeder');
  console.log('====================================\n');
  console.log(`📊 Total records to process: ${STUDENT_DATA.length}\n`);

  // Step 1: Create Schools
  const uniqueSchools = [...new Set(STUDENT_DATA.map(r => r[2]))];
  console.log(`🏫 Creating ${uniqueSchools.length} schools...`);

  const schoolMap = {};
  for (const schoolName of uniqueSchools) {
    const code = schoolName.replace(/School of /gi, '').replace(/[^a-zA-Z0-9 ]/g, '').trim().replace(/\s+/g, '_').toUpperCase().substring(0, 30);
    let school = await prisma.school.findFirst({ where: { name: schoolName } });
    if (!school) {
      const codeExists = await prisma.school.findUnique({ where: { code } });
      school = codeExists || await prisma.school.create({ data: { name: schoolName, code } });
      if (!codeExists) console.log(`   🆕 ${schoolName}`);
    } else {
      console.log(`   ✅ ${schoolName}`);
    }
    schoolMap[schoolName] = school.id;
  }

  // Step 2: Create Departments
  const uniqueDepts = [...new Set(STUDENT_DATA.map(r => `${r[2]}|||${r[3]}`))];
  console.log(`\n🏛️  Creating ${uniqueDepts.length} departments...`);

  const deptMap = {};
  for (const combo of uniqueDepts) {
    const [schoolName, deptName] = combo.split('|||');
    const schoolId = schoolMap[schoolName];
    const code = deptName.replace(/[^a-zA-Z0-9 ]/g, '').trim().replace(/\s+/g, '_').toUpperCase().substring(0, 20);
    let dept = await prisma.department.findFirst({ where: { schoolId, name: deptName } });
    if (!dept) {
      try {
        dept = await prisma.department.create({ data: { name: deptName, code, schoolId } });
        console.log(`   🆕 ${deptName} @ ${schoolName.substring(0, 30)}`);
      } catch (e) {
        dept = await prisma.department.findFirst({ where: { schoolId, code } });
        if (!dept) throw e;
      }
    } else {
      console.log(`   ✅ ${deptName} @ ${schoolName.substring(0, 30)}`);
    }
    deptMap[combo] = dept.id;
  }

  // Step 3: Insert Students
  console.log(`\n👤 Inserting ${STUDENT_DATA.length} students...`);
  let created = 0, skipped = 0, errors = 0;

  for (let i = 0; i < STUDENT_DATA.length; i++) {
    const [regId, name, schoolName, deptName, year, gender] = STUDENT_DATA[i];
    const rollNumber = regId && regId.length > 2 ? regId : `TEMP-${i}-${name.replace(/[^a-zA-Z]/g, '').substring(0, 15)}`;
    
    try {
      const existing = await prisma.student.findUnique({ where: { rollNumber } });
      if (existing) { skipped++; continue; }

      await prisma.student.create({
        data: {
          rollNumber,
          name,
          className: year,
          gender: gender === 'Male' ? 'MALE' : gender === 'Female' ? 'FEMALE' : null,
          schoolId: schoolMap[schoolName] || undefined,
          departmentId: deptMap[`${schoolName}|||${deptName}`] || undefined,
        },
      });
      created++;
      if (created % 50 === 0) console.log(`   ... ${created} created`);
    } catch (err) {
      errors++;
      if (errors <= 5) console.error(`   ❌ "${name}": ${err.message.substring(0, 60)}`);
    }
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`✅ Created:  ${created}`);
  console.log(`⏭️  Skipped:  ${skipped}`);
  console.log(`❌ Errors:   ${errors}`);
  console.log(`${'='.repeat(50)}`);

  const total = await prisma.student.count();
  const schools = await prisma.school.count();
  const depts = await prisma.department.count();
  console.log(`\n🏟️  Database: ${total} students, ${schools} schools, ${depts} departments`);
  console.log('🎉 Done!\n');
}

main()
  .catch(e => { console.error('Fatal:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
