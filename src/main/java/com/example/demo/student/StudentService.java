package com.example.demo.student;

import com.example.demo.student.exception.BadRequestException;
import com.example.demo.student.exception.StudentNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@AllArgsConstructor
@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public void addNewStudent(Student student) {
        Boolean existEmail = studentRepository.selectExistsEmail(student.getEmail());

        if( existEmail ) {
            throw new BadRequestException("Email" + student.getEmail() + " is taken.");
        }
        studentRepository.save(student);
    }

    public void deleteStudent(Long studentId) {
        if(!studentRepository.existsById(studentId)) {
            throw new StudentNotFoundException("Student with id " + studentId + " does not exists.");
        }
        studentRepository.deleteById(studentId);
    }

    @Transactional
    public void updateStudent(Student student) {
        Long studentId = student.getId();

        // check if the student exists
        Student found = studentRepository.findById(studentId)
                .orElseThrow(() -> new StudentNotFoundException(
                    "Student with id " + studentId + " does not exists.")
                );

        // check if the email is exists
        String email = student.getEmail();
        Boolean existEmail = studentRepository.selectExistsEmail(email);
            if( existEmail ) {
            throw new BadRequestException("Email " + student.getEmail() + " is taken.");
        }

        String name = student.getName();

        if( name != null &&
            name.length() > 0 &&
            !Objects.equals(found.getName(), name)) {
            found.setName(name);
        }

        if( email != null &&
            email.length() > 0 &&
            !Objects.equals(found.getEmail(), email)) {
            found.setEmail(email);
        }

        Gender gender = student.getGender();
        if( gender != null &&
            !Objects.equals(found.getGender(), gender)) {
            found.setGender(gender);
        }

    }
}
