import math


# main library that the tetrahedron should come under
# other shapes are the cuboid and the cylinder
class GeometryLibrary:
    pass

# a point has 3 coordinates since a tetrahedron is a 3d shape
#  4 faces
#  4 edges
#  6 vertices
#  the area of a triangle is 0.5 x base x height
#  so the surface area of a tetrahedron is 0.5 x base x height x 4
class Point:
    def __init__(self, x, y, z):
        self.x = x
        self.y = y
        self.z = z

    def __eq__(self, other):
        if not isinstance(other, Point):
            return NotImplemented
        return self.x == other.x and self.y == other.y and self.z == other.z


class Tetrahedron(GeometryLibrary):
    def __init__(self, p1, p2, p3, p4):
        self.p1 = p1
        self.p2 = p2
        self.p3 = p3
        self.p4 = p4


    def __eq__(self, other):
        if not isinstance(other, Tetrahedron):
            return NotImplemented

        return (self.p1 == other.p1 and self.p2 == other.p2 and self.p3 == other.p3 and self.p4 == other.p4)



    def distance(self, p1, p2):
        return math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2 + (p1.z - p2.z) ** 2)

    


    def centroid(self):
        x = (self.p1.x + self.p2.x + self.p3.x + self.p4.x) / 4
        y = (self.p1.y + self.p2.y + self.p3.y + self.p4.y) / 4
        z = (self.p1.z + self.p2.z + self.p3.z + self.p4.z) / 4
        return Point(x, y, z)

    def surfaceArea(self):
        a = self.distance(self.p1, self.p2)
        b = self.distance(self.p1, self.p3)
        c = self.distance(self.p1, self.p4)
        d = self.distance(self.p2, self.p3)
        e = self.distance(self.p2, self.p4)
        f = self.distance(self.p3, self.p4)

        s1 = (a + d + e)/ 2
        s2 = (a + b + f)/ 2
        s3 = (b + d + c)/ 2
        s4 = (c + e + f)/ 2

        area1 = math.sqrt(s1 * (s1 - a) * (s1 - d) * (s1 - e))
        area2 = math.sqrt(s2 * (s2 - a) * (s2 - b) * (s2 - f))
        area3 = math.sqrt(s3 * (s3 - b) * (s3 - d) * (s3 - c))
        area4 = math.sqrt(s4 * (s4 - c) * (s4 - e) * (s4 - f))

        return area1, area2, area3, area4


def main():
    # create vertices (points) for a tetrahedron
    p1 = Point(0, 0, 0)
    p2 = Point(1, 0, 0)
    p3 = Point(0, 1, 0)
    p4 = Point(0, 0, 1)

    tetrahedron = Tetrahedron(p1, p2, p3, p4)

    centroid = tetrahedron.centroid()
    print(f"Centroid: ({centroid.x}, {centroid.y}, {centroid.z})")

    # calculate and print the surface area of the tetrahedron
    surface_area = tetrahedron.surfaceArea()
    print(f"Surface Area: {surface_area}")

    # create another tetrahedron for comparison
    q1 = Point(0, 0, 0)
    q2 = Point(1, 0, 0)
    q3 = Point(0, 1, 0)
    q4 = Point(0, 0, 1)

    tetrahedron2 = Tetrahedron(q1, q2, q3, q4)

    # compare the two tetrahedra using the overriden operator
    print(f"Are the tetrahedra equal? { tetrahedron == tetrahedron2}")

    # how can we make it not equal?

if __name__ == "__main__":
    main()